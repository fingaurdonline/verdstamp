"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { BiTrash } from "react-icons/bi"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CryptoCurrency } from "@/lib/types"
import Image from "next/image"
import useCryptoList from "@/hooks/useCryptoData"

export function CryptoSelector(
    { value, setValue, open, setOpen }: {
        value: string
        setValue: (value: string) => void
        open: boolean
        setOpen: (open: boolean) => void
    }
) {
    const { data: cryptoData } = useCryptoList()
    const bitcoin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.symbol === "BTC") as CryptoCurrency
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-[.87rem] flex lg:block space-x-2 lg:space-x-0 items-center font-bold font-Manrope dark:text-lnd-fg">
                <span className="flex lg:hidden w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                    1
                </span>
                Select Coin/Token
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between pl-6 border-none bg-lnd-surface-2 text-lnd-fg hover:bg-lnd-surface-2 [&[data-state=open]>svg]:rotate-180 rounded-sm dark:bg-lnd-surface dark:text-lnd-fg dark:hover:bg-lnd-surface-2"
                    >
                        {value
                            ? <div>
                                {cryptoData?.data?.data?.map((crypto: CryptoCurrency) => (
                                    <div key={crypto?.name} className="flex items-center space-x-1.5">
                                        {
                                            crypto?.name === value &&
                                            <>
                                                <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto?.id}.png`} alt={crypto?.name} width={24} height={24} className="w-5 h-5 rounded-full" />
                                                <div className="font-bold font-Manrope tracking-wider pr-2.5 dark:text-lnd-fg">
                                                    {crypto?.symbol}
                                                </div>
                                                <div className="text-sm text-lnd-fg-muted font-light">
                                                    {crypto?.name}
                                                </div>
                                            </>
                                        }
                                    </div>
                                ))}
                            </div>
                            : <div className="flex items-center space-x-1.5">
                                <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${bitcoin?.id}.png`} alt={bitcoin?.name} width={24} height={24} className="w-5 h-5 rounded-full" />
                                <div className="font-bold font-Manrope tracking-wider pr-2.5 dark:text-lnd-fg">{bitcoin?.symbol}</div>
                                <div className="text-sm text-lnd-fg-muted font-light">{bitcoin?.name}</div>
                            </div>
                        }
                        <ChevronDown className="opacity-50 w-5 h-5 text-lnd-accent  dark:text-lnd-fg-muted transition-all duration-300" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-72 lg:w-[550px] h-auto p-0 shadow shadow-black/50 border-none dark:bg-lnd-surface dark:shadow-black/50">
                    <Command className="space-y-4 pt-4 pb-1">
                        <CommandInput className="placeholder:text-sm placeholder:text-lnd-fg-muted rounded-md dark:bg-lnd-surface dark:text-lnd-fg dark:placeholder:text-lnd-fg-muted" placeholder="Search by coin/token" />
                        <div className="flex flex-col gap-3 px-4">
                            <Label className="flex items-center justify-between dark:text-lnd-fg">
                                <span>History</span>
                                <BiTrash className="dark:text-lnd-fg-muted" />
                            </Label>
                            <div className="flex space-x-3">
                                <Button onClick={() => setValue("Tether USDt")} className="bg-lnd-surface-2 hover:bg-lnd-surface-2 text-sm text-lnd-fg-muted rounded-[1.25rem] py-[.22rem] px-8 dark:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 dark:text-lnd-fg-muted">USDT</Button>
                                <Button onClick={() => setValue("Bitcoin")} className="bg-lnd-surface-2 hover:bg-lnd-surface-2 text-sm text-lnd-fg-muted rounded-[1.25rem] py-[.22rem] px-8 dark:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 dark:text-lnd-fg-muted">BTC</Button>
                            </div>
                        </div>
                        <Label className="px-4 dark:text-lnd-fg">Crypto List</Label>
                        <div className="w-full h-[200px] overflow-hidden">
                            <ScrollArea className="w-full h-full">
                                <CommandList className="w-auto h-auto">
                                    <CommandEmpty className="dark:text-lnd-fg-muted">No data found.</CommandEmpty>
                                    {cryptoData?.data?.data?.map((crypto: CryptoCurrency) => (
                                        <CommandItem
                                            key={crypto?.name}
                                            value={crypto?.name}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                            className="py-2.5 border-b last:border-0 rounded-none dark:border-lnd-border dark:bg-lnd-surface dark:hover:bg-lnd-surface-2"
                                        >
                                            <div className="w-full flex items-center">
                                                <div className="flex items-center space-x-1.5">
                                                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto?.id}.png`} alt={crypto?.name} width={24} height={24} className="w-5 h-5 rounded-full" />
                                                    <div className="w-20 font-semibold font-Manrope tracking-wider dark:text-lnd-fg">{crypto?.symbol}</div>
                                                </div>
                                                <div className="w-36 flex justify-start text-sm text-lnd-fg-muted font-normal">{crypto?.name}</div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandList>
                                <ScrollBar className="w-2" />
                            </ScrollArea>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}