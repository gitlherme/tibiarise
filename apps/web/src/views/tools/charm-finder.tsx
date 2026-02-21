"use client";

import { getCreatureDetails } from "@/app/actions/charm-finder";
import { SharedBreadcrumb } from "@/components/shared/shared-breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CHARMS, Charm } from "@/data/charms";
import { TibiaWikiCreature } from "@/models/tibia-data.model";
import { useCharmFinderStore } from "@/stores/charm-finder.store";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CharmConfiguration {
  id: number;
  assignments: Map<string, Charm>; // Creature Name -> Charm
  damagePerProc: Map<string, number>; // Creature Name -> Damage per proc
  totalScore: number;
  efficiency: number; // Percentage relative to best score
}

interface AnalyzedCreature {
  name: string;
  count: number;
  data?: TibiaWikiCreature;
  // bestCharm and score removed from here as they belong to a specific configuration
}

export default function CharmFinderView() {
  const {
    selectedCharms,
    toggleCharm,
    characterHealth,
    characterMana,
    setCharacterHealth,
    setCharacterMana,
  } = useCharmFinderStore();
  const [analyzerText, setAnalyzerText] = useState("");
  const [creaturesData, setCreaturesData] = useState<AnalyzedCreature[]>([]);
  const [configurations, setConfigurations] = useState<CharmConfiguration[]>(
    [],
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSelectAll = useCallback(() => {
    CHARMS.forEach((charm) => {
      if (!selectedCharms.includes(charm.name)) {
        toggleCharm(charm.name);
      }
    });
  }, [selectedCharms, toggleCharm]);

  const handleClearAll = useCallback(() => {
    CHARMS.forEach((charm) => {
      if (selectedCharms.includes(charm.name)) {
        toggleCharm(charm.name);
      }
    });
  }, [selectedCharms, toggleCharm]);

  // Auto-scroll to results on mobile after analysis
  useEffect(() => {
    if (configurations.length > 0 && resultsRef.current) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [configurations]);

  // toggleCharm removed from here as it comes from store

  const parseLog = (text: string) => {
    // 1. Extract content between "Killed Monsters:" and "Looted Items:" (or end of string)
    // Using [\s\S]*? for multiline non-greedy match
    const sectionRegex = /Killed Monsters:([\s\S]*?)(?:Looted Items:|$)/i;
    const sectionMatch = text.match(sectionRegex);

    if (!sectionMatch) {
      // Fallback: try to match simple lines if headers are missing,
      // but user explicitly said "Killed Monsters" is present.
      // If not found, maybe return empty or try parsing whole text?
      // Let's return empty to be safe as per requirement.
      return [];
    }

    const killedMonstersSection = sectionMatch[1];

    // 2. Parse individual lines in that section
    const lineRegex = /(\d+)x\s+([a-zA-Z\s'-]+)/g;
    const matches = [...killedMonstersSection.matchAll(lineRegex)];
    const creatures: Record<string, number> = {};

    for (const match of matches) {
      const count = parseInt(match[1]);
      const name = match[2].trim();
      if (name.toLowerCase().includes("session")) continue;
      creatures[name] = (creatures[name] || 0) + count;
    }

    return Object.entries(creatures).map(([name, count]) => ({ name, count }));
  };

  const fetchCreatureData = async (
    name: string,
  ): Promise<TibiaWikiCreature | null> => {
    // TibiaWiki handles the title casing in the server action, but we can do it here too if needed.
    // However, it's cleaner to just call the server action.
    try {
      const data = await getCreatureDetails(name);
      return data;
    } catch (error) {
      console.error("Fetch error", error);
      return null;
    }
  };

  const calculateBestCharm = (
    creature: TibiaWikiCreature,
    count: number,
    charmName: string,
  ) => {
    const charm = CHARMS.find((c) => c.name === charmName);
    if (!charm) return { score: 0, damage: 0 };

    let score = 0;
    let damage = 0;
    // HP from TibiaWiki is string with commas, e.g. "2,500"
    const hp =
      typeof creature.hp === "string"
        ? parseInt(creature.hp.replace(/,/g, "")) || 0
        : 0;
    const baseDamage = 0.05 * hp; // 5% of max HP

    if (charm.name === "Overpower") {
      const charHealthDamage = characterHealth * 0.05;
      const monsterMaxDamage = hp * 0.08;
      damage = Math.min(charHealthDamage, monsterMaxDamage);
      score = count * damage;
    } else if (charm.name === "Overflux") {
      const charManaDamage = characterMana * 0.025;
      const monsterMaxDamage = hp * 0.08;
      damage = Math.min(charManaDamage, monsterMaxDamage);
      score = count * damage;
    } else if (charm.type === "Damage" && charm.element) {
      // Check effectiveness using *DmgMod fields
      // Format is "100%", "110%", "0%" (immune)
      // "100%?" means uncertain but usually 100%.
      // We need to map charm element to the correct field
      // 'Ice' -> iceDmgMod

      const modKey =
        `${charm.element.toLowerCase()}DmgMod` as keyof TibiaWikiCreature;
      // @ts-ignore
      const modString = creature[modKey];

      let modifier = 1.0;
      if (typeof modString === "string") {
        // Remove % and ? and parse
        const cleanString = modString.replace("%", "").replace("?", "");
        const percentage = parseInt(cleanString);
        if (!isNaN(percentage)) {
          modifier = percentage / 100;
        }
      }

      // Mitigation calculation
      // Formula: Damage * MitigationMultiplier
      // MitigationMultiplier = 1 - (Mitigation / 100)
      // Where Mitigation is a percentage (e.g. 2.92)

      let mitigation = 0;
      if (creature.mitigation) {
        const mitVal = parseFloat(creature.mitigation);
        if (!isNaN(mitVal)) {
          mitigation = mitVal;
        }
      }
      const mitigationMultiplier = 1 - mitigation / 100;

      damage = baseDamage * modifier * mitigationMultiplier;
      score = count * damage;
    } else if (charm.type === "Critical") {
      // For critical, we estimate equivalent damage
      damage = hp * 0.03;
      score = count * damage;
    } else if (charm.type === "Utility") {
      // Dodge, Parry, Adrenaline Burst, etc.
      // These are useful regardless of element, so give them a positive score
      // Assume roughly 2% effectiveness relative to HP for defensive/utility value
      damage = hp * 0.02;
      score = count * damage;
    }

    return { score, damage };
  };

  const handleAnalyze = async () => {
    if (!analyzerText.trim()) {
      toast.error("Please paste the Hunt Analyzer log.");
      return;
    }
    if (selectedCharms.length === 0) {
      toast.error("Please select at least one charm.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCreaturesData([]);
    setConfigurations([]);

    try {
      const parsed = parseLog(analyzerText);

      // Sort by count desc to prioritize checking most killed
      parsed.sort((a, b) => b.count - a.count);

      // Limit to top 15 unique creatures to ensure we cover the important ones
      const topCreatures = parsed.slice(0, 15);

      // 1. Fetch data for all creatures first
      const loadedCreatures: AnalyzedCreature[] = [];

      for (const item of topCreatures) {
        const data = await fetchCreatureData(item.name);
        loadedCreatures.push({
          name: item.name,
          count: item.count,
          data: data || undefined,
        });
      }

      setCreaturesData(loadedCreatures);

      // 2. Global Optimization (Backtracking)
      // We want to find top 3 charm configurations.

      const availableCharms = selectedCharms;
      const creatures = loadedCreatures; // Already sorted by count DESC

      // Limit to top creatures to keep recursion fast.
      const limit = Math.max(12, availableCharms.length + 2);
      const activeCreatures = creatures.slice(0, limit);

      const validSolutions: {
        assignments: Map<string, string>;
        score: number;
      }[] = [];

      const solve = (
        creatureIdx: number,
        currentScore: number,
        currentAssignment: Map<string, string>,
        usedCharms: Set<string>,
      ) => {
        // Base case: processed all active creatures
        if (creatureIdx >= activeCreatures.length) {
          if (currentScore > 0) {
            validSolutions.push({
              assignments: new Map(currentAssignment),
              score: currentScore,
            });
          }
          return;
        }

        const creature = activeCreatures[creatureIdx];

        // Option 1: Don't assign any charm to this creature
        solve(creatureIdx + 1, currentScore, currentAssignment, usedCharms);

        // Option 2: Try assigning each available charm
        if (creature.data) {
          for (const charmName of availableCharms) {
            if (!usedCharms.has(charmName)) {
              const { score } = calculateBestCharm(
                creature.data,
                creature.count,
                charmName,
              );

              if (score > 0) {
                usedCharms.add(charmName);
                currentAssignment.set(creature.name, charmName);

                solve(
                  creatureIdx + 1,
                  currentScore + score,
                  currentAssignment,
                  usedCharms,
                );

                // Backtrack
                usedCharms.delete(charmName);
                currentAssignment.delete(creature.name);
              }
            }
          }
        }
      };

      solve(0, 0, new Map(), new Set());

      // Sort solutions by score DESC
      validSolutions.sort((a, b) => b.score - a.score);

      // Filter to keep top unique solutions (assignments map must be different)
      const uniqueSolutions: {
        assignments: Map<string, string>;
        score: number;
      }[] = [];
      const seenAssignments = new Set<string>();

      for (const sol of validSolutions) {
        // Create a canonical string representation of the assignment for deduplication
        const entries = Array.from(sol.assignments.entries()).sort();
        const key = JSON.stringify(entries);

        if (!seenAssignments.has(key)) {
          seenAssignments.add(key);
          uniqueSolutions.push(sol);
        }

        if (uniqueSolutions.length >= 3) break; // Keep top 3
      }

      // If no solutions found (e.g. no creatures fetched), return empty
      if (uniqueSolutions.length === 0) {
        setConfigurations([]);
        return;
      }

      const bestScore = uniqueSolutions[0].score;

      const finalConfigs: CharmConfiguration[] = uniqueSolutions.map(
        (sol, idx) => {
          const assignments = new Map<string, Charm>();
          const damagePerProc = new Map<string, number>();

          sol.assignments.forEach((charmName, creatureName) => {
            const charm = CHARMS.find((c) => c.name === charmName);
            const creature = loadedCreatures.find(
              (c) => c.name === creatureName,
            );
            if (charm && creature && creature.data) {
              assignments.set(creatureName, charm);
              const { damage } = calculateBestCharm(
                creature.data,
                creature.count,
                charmName,
              );
              damagePerProc.set(creatureName, damage);
            }
          });

          return {
            id: idx,
            assignments,
            damagePerProc,
            totalScore: sol.score,
            efficiency: (sol.score / bestScore) * 100,
          };
        },
      );

      setConfigurations(finalConfigs);
    } catch (error) {
      const errorMessage =
        "An error occurred while analyzing. Please check your input and try again.";
      toast.error(errorMessage);
      setAnalysisError(errorMessage);
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 py-12">
      <div className="col-span-full">
        <SharedBreadcrumb
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Charm Finder" },
          ]}
          className="mb-2"
        />
      </div>
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>1. Select Your Charms</CardTitle>
                <CardDescription>
                  Check the charms you have unlocked on your character.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {CHARMS.map((charm) => (
                <div
                  key={charm.name}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${selectedCharms.includes(charm.name) ? "bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <Checkbox
                    id={`charm-${charm.name}`}
                    checked={selectedCharms.includes(charm.name)}
                    onCheckedChange={() => toggleCharm(charm.name)}
                    className="transition-all duration-200"
                  />
                  <Label
                    htmlFor={`charm-${charm.name}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Image
                      src={charm.image}
                      alt={charm.name}
                      width={24}
                      height={24}
                      className="object-contain w-6 h-6"
                    />
                    {charm.name}
                  </Label>
                </div>
              ))}
            </div>
            {(selectedCharms.includes("Overpower") ||
              selectedCharms.includes("Overflux")) && (
              <div className="mt-6 flex flex-col gap-4 border-t border-border/50 pt-4 md:flex-row md:items-center">
                {selectedCharms.includes("Overpower") && (
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="character-health">Character Health</Label>
                    <Input
                      id="character-health"
                      type="number"
                      placeholder="e.g. 5000"
                      value={characterHealth || ""}
                      onChange={(e) =>
                        setCharacterHealth(parseInt(e.target.value) || 0)
                      }
                      min="0"
                    />
                  </div>
                )}
                {selectedCharms.includes("Overflux") && (
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="character-mana">Character Mana</Label>
                    <Input
                      id="character-mana"
                      type="number"
                      placeholder="e.g. 15000"
                      value={characterMana || ""}
                      onChange={(e) =>
                        setCharacterMana(parseInt(e.target.value) || 0)
                      }
                      min="0"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>2. Paste Hunt Analyzer</CardTitle>
            <CardDescription>
              Copy the &quot;Session data&quot; from your Tibia Hunt Analyzer
              and paste it here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Paste your Hunt Analyzer session data here.\n\nExample:\nSession data: From 2023-09-13, 10:35:02 to 2023-09-13, 11:40:55\nKilled Monsters:\n251x darklight striker\n120x darklight emissary\n95x darklight construct...`}
              className="min-h-[200px] focus-visible:ring-primary/30"
              value={analyzerText}
              onChange={(e) => setAnalyzerText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Press Ctrl+Enter to analyze
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="min-w-[180px]"
              >
                {isAnalyzing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Analyze & Recommend
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={resultsRef} className="space-y-6">
        {analysisError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{analysisError}</p>
            </CardContent>
          </Card>
        )}
        {configurations.length > 0 && creaturesData.length > 0 ? (
          <div className="space-y-6">
            <Card className="h-full border-primary border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Best Recommendation</CardTitle>
                  <Badge className="bg-primary text-lg">100% Efficiency</Badge>
                </div>
                <CardDescription>
                  Optimal charm configuration for maximum damage output.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creaturesData.map((item, idx) => {
                    const bestConfig = configurations[0];
                    const assignedCharm = bestConfig.assignments.get(item.name);
                    const damage = bestConfig.damagePerProc.get(item.name);

                    return (
                      <div
                        key={idx}
                        className="flex items-start justify-between border-b pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          {item.data?.image_url && (
                            <Image
                              src={item.data.image_url}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-contain"
                              unoptimized
                            />
                          )}
                          <div>
                            <h4 className="font-semibold capitalize">
                              {item.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Killed: {item.count}
                            </p>
                            {item.data && (
                              <div className="flex gap-2 text-xs mt-1">
                                {item.data.weakness && (
                                  <span className="text-success">
                                    Weak: {item.data.weakness.join(", ")}
                                  </span>
                                )}
                                {item.data.immune && (
                                  <span className="text-destructive">
                                    Immune: {item.data.immune.join(", ")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {assignedCharm ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="text-right">
                                <div className="font-bold text-primary">
                                  {assignedCharm.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {damage
                                    ? `~${Math.round(damage)} dmg/proc`
                                    : assignedCharm.element ||
                                      assignedCharm.type}
                                </div>
                              </div>
                              <Image
                                src={assignedCharm.image}
                                alt={assignedCharm.name}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {selectedCharms.length > 0
                                ? "No charm available"
                                : "Select charms first"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {configurations.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Alternative Configurations
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {configurations.slice(1).map((config) => (
                    <AccordionItem key={config.id} value={`item-${config.id}`}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>Option #{config.id + 1}</span>
                          <Badge variant="secondary">
                            {config.efficiency.toFixed(1)}% Efficiency
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-sm text-muted-foreground">
                            This configuration is{" "}
                            {(100 - config.efficiency).toFixed(1)}% less
                            effective than the optimal choice.
                          </p>
                          {creaturesData.map((item, idx) => {
                            const assignedCharm = config.assignments.get(
                              item.name,
                            );
                            const damage = config.damagePerProc.get(item.name);
                            const bestConfigCharm =
                              configurations[0].assignments.get(item.name);

                            // Highlight changes
                            const isDifferent =
                              assignedCharm?.name !== bestConfigCharm?.name;

                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between border-b py-2 last:border-0 ${isDifferent ? "bg-muted/30 -mx-2 px-2 rounded" : ""}`}
                              >
                                <div className="flex items-center gap-2">
                                  {item.data?.image_url && (
                                    <Image
                                      src={item.data.image_url}
                                      alt={item.name}
                                      width={32}
                                      height={32}
                                      className="object-contain"
                                      unoptimized
                                    />
                                  )}
                                  <span className="capitalize text-sm font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  {assignedCharm ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <div className="text-right">
                                        <div
                                          className={`text-sm ${isDifferent ? "font-bold text-orange-500" : "text-muted-foreground"}`}
                                        >
                                          {assignedCharm.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                          {damage
                                            ? `~${Math.round(damage)} dmg`
                                            : ""}
                                        </div>
                                      </div>
                                      <Image
                                        src={assignedCharm.image}
                                        alt={assignedCharm.name}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">
                                      -
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        ) : !analysisError ? (
          <Card className="h-full border-border/50">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Analysis results will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10 space-y-4">
                <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                <div className="space-y-2">
                  <p className="font-medium">No analysis yet</p>
                  <p className="text-sm max-w-xs">
                    Select your charms, paste your Hunt Analyzer log, and click
                    &quot;Analyze &amp; Recommend&quot; to see the best charm
                    assignments.
                  </p>
                </div>
                <div className="text-xs space-y-1 mt-4 bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium">💡 Tips:</p>
                  <ul className="text-left list-disc list-inside space-y-1">
                    <li>Select all charms you have unlocked</li>
                    <li>Use a session with at least 100+ kills</li>
                    <li>The analyzer considers element weaknesses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
