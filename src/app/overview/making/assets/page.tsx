// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Eye } from "lucide-react";
// import DropDown from "../../components/DropDown";
// import { PiArrowUpBold } from "react-icons/pi";
// import CryptoTable from "../components/CryptoTable";
// import { Icon } from "@iconify/react";

export default function Assets() {
    // const { data: user } = useUserData()
    // return (
    //     <div className="w-full lg:w-auto h-auto flex flex-col gap-4">
    //         <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
    //             <span className="w-fit h-6 bg-blend-overlay">
    //                 <Icon icon="clarity:line-chart-solid" className="w-6 h-6 text-lnd-accent/30 relative z-50" />
    //                 <Icon icon="ri:triangle-fill" className="w-3 h-3 text-lnd-fg-muted/50 relative -top-2 left-[5px] z-10" />
    //             </span>
    //             <span className="db-title">
    //                 AMM Account
    //             </span>
    //         </div>
    //         <div className="w-full h-auto">
    //             <div className="w-full lg:w-auto h-auto py-5 px-5 flex flex-col bg-lnd-surface rounded-[1.25rem] space-y-4">
    //                 <div className="w-full lg:w-auto h-auto flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 pt-1">
    //                     <div className="w-auto h-auto flex flex-col gap-1.5">
    //                         <div className="w-auto h-auto flex space-x-2.5">
    //                             <span className="font-Manrope text-[0.88rem] text-lnd-fg mr-1.5">
    //                                 My Liquidity ({user?.crypto === "tether usdt" ? "USDT" : user?.crypto === "bitcoin" ? "BTC" : "ETH"})
    //                             </span>
    //                             <DropDown />
    //                             <span className="w-auto h-auto flex items-center justify-center pl-2">
    //                                 <Eye className="w-[1.22rem] h-[1.22rem] text-lnd-fg-muted/80" />
    //                             </span>
    //                         </div>
    //                         <div className="w-auto h-auto flex items-center gap-5 font-Manrope">
    //                             <span className="text-[1.97rem] font-extrabold text-lnd-fg">
    //                                 0.0000
    //                             </span>
    //                             <span className="text-[1.3rem] font-medium text-lnd-fg-muted">
    //                                 ≈0.00 USD
    //                             </span>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <Separator className="bg-lnd-surface-2/80" />
    //                 <div className="w-full lg:w-auto h-auto flex flex-col lg:flex-row lg:items-center gap-7 pt-1">
    //                     <span className="flex items-center space-x-2">
    //                         <span className="w-auto h-auto flex items-center justify-center px-2.5 py-2.5 bg-lnd-surface-2 rounded-lg">
    //                             <PiArrowUpBold className="w-[1.2rem] h-[1.2rem] text-lnd-fg-muted" />
    //                         </span>
    //                         <span className="border-b border-lnd-border border-dashed text-sm text-lnd-fg-muted font-medium font-Manrope">
    //                             Today&apos;s PNL
    //                         </span>
    //                         <span>
    //                             --
    //                         </span>
    //                     </span>
    //                     <Button className="w-full lg:w-fit h-fit flex items-center bg-lnd-accent/10 hover:bg-lnd-accent/10 py-2 lg:py-1.5 px-6 rounded-sm">
    //                         <span className="text-lnd-accent font-Manrope text-xs font-medium">
    //                             Activate PNL Analysis
    //                         </span>
    //                     </Button>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="w-full h-auto flex flex-col lg:flex-row lg:justify-between space-x-0 lg:space-x-5">
    //             <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface rounded-t-3xl lg:rounded-[1.25rem]">
    //                 <div className="w-full h-auto text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope">
    //                 Total Tx Incomes (USD)
    //                 </div>
    //                 <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold">
    //                     0
    //                 </div>
    //             </div>
    //             <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface lg:rounded-[1.25rem]">
    //                 <div className="w-full h-auto flex flex-nowrap text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope">
    //                 Last-day Tx Incomes (USD)
    //                 </div>
    //                 <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold">
    //                     0
    //                 </div>
    //             </div>
    //             <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface rounded-b-3xl lg:rounded-[1.25rem]">
    //                 <div className="w-full h-auto text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope">
    //                 AMM Markets (USD)
    //                 </div>
    //                 <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold">
    //                     0
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="w-auto h-auto flex flex-col bg-lnd-surface rounded-[1.25rem]">
    //             <CryptoTable />
    //         </div>
    //     </div>
    // )
}
