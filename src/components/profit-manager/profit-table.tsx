import { Table, TableHead, TableHeader, TableRow } from "../ui/table";

export const ProfitTable = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Character</TableHead>
            <TableHead>Hunt Name</TableHead>
            <TableHead>Hunt Date</TableHead>
            <TableHead>Gross Profit</TableHead>
            <TableHead>Prey Cards Qtd.</TableHead>
            <TableHead>Boost Value (tc)</TableHead>
            <TableHead>Net Profit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* Table body would go here, e.g. */}
        {/* <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.character}</TableCell>
              <TableCell>{item.huntName}</TableCell>
              <TableCell>{item.huntDate}</TableCell>
              <TableCell>{item.profit}</TableCell>
              <TableCell>{item.preyCardsQty}</TableCell>
              <TableCell>{item.boostValue}</TableCell>
              <TableCell>{item.netProfit}</TableCell>
              <TableCell>
                <button className="text-blue-500 hover:underline">
                  Edit
                </button>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
    </div>
  );
};
