import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const vipData = [
  {
    level: "VIP0",
    spotFees: "0.2%",
    spotFeesDeduction: "0.16%",
    futuresRateMaker: "0.03%",
    futuresRateTaker: "0.05%",
  },
  {
    level: "VIP1",
    spotFees: "0.18%",
    spotFeesDeduction: "0.144%",
    futuresRateMaker: "0.028%",
    futuresRateTaker: "0.048%",
  },
  {
    level: "VIP2",
    spotFees: "0.16%",
    spotFeesDeduction: "0.128%",
    futuresRateMaker: "0.026%",
    futuresRateTaker: "0.046%",
  },
  {
    level: "VIP3",
    spotFees: "0.14%",
    spotFeesDeduction: "0.112%",
    futuresRateMaker: "0.024%",
    futuresRateTaker: "0.044%",
  },
  {
    level: "VIP4",
    spotFees: "0.12%",
    spotFeesDeduction: "0.096%",
    futuresRateMaker: "0.022%",
    futuresRateTaker: "0.042%",
  },
  {
    level: "VIP5",
    spotFees: "0.1%",
    spotFeesDeduction: "0.08%",
    futuresRateMaker: "0.02%",
    futuresRateTaker: "0.04%",
  },
]

export function VipPricingTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800 text-[.79rem]">
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 whitespace-nowrap">VIP Lv</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center hidden lg:table-cell">Spot Fees</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center lg:hidden whitespace-nowrap">Spot fe..</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center hidden lg:table-cell">Spot Fees (CET Deduction)</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center lg:hidden whitespace-nowrap">Spot Fees (CET...</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center hidden lg:table-cell">Futures Rate</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-400 font-extralight py-3 px-6 text-center lg:hidden whitespace-nowrap">Future...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vipData.map((row, index) => (
            <TableRow
              key={row.level}
              className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 text-[.8rem] ${index === vipData.length - 1 ? "border-b-0" : ""}`}
            >
              <TableCell className="py-3 px-6 font-medium text-gray-900 dark:text-gray-100">{row.level}</TableCell>
              <TableCell className="py-3 px-6 text-center hidden lg:table-cell">
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.spotFees}</span>
              </TableCell>
              <TableCell className="py-3 px-6 text-center lg:hidden">
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.spotFees}</span>
              </TableCell>
              <TableCell className="py-3 px-6 text-center hidden lg:table-cell">
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.spotFeesDeduction}</span>
              </TableCell>
              <TableCell className="py-3 px-6 text-center lg:hidden">
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.spotFeesDeduction}</span>
              </TableCell>
              <TableCell className="py-3 px-6 text-center hidden lg:table-cell">
                <div className="flex justify-center gap-4">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Maker {row.futuresRateMaker}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Taker {row.futuresRateTaker}</span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-6 text-center lg:hidden">
                <div className="flex justify-center gap-4">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Maker {row.futuresRateMaker}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Taker {row.futuresRateTaker}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
