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
                        className="w-full justify-between rounded-md border-none bg-lnd-surface-2 pl-4 text-lnd-fg hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg dark:hover:bg-lnd-surface-2 sm:pl-6 [&[data-state=open]>svg]:rotate-180"
                    >
                        {value
                            ? <div className="flex min-w-0 items-center">
                                {cryptoData?.data?.data?.map((crypto: CryptoCurrency) => (
                                    <div key={crypto?.name} className="flex min-w-0 items-center gap-1.5">
                                        {
                                            crypto?.name === value &&
                                            <>
                                                <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto?.id}.png`} alt={crypto?.name} width={24} height={24} className="h-5 w-5 shrink-0 rounded-full" />
                                                <div className="shrink-0 pr-1.5 font-Manrope font-bold tracking-wider sm:pr-2.5">
                                                    {crypto?.symbol}
                                                </div>
                                                <div className="truncate text-sm font-light text-lnd-fg-muted">
                                                    {crypto?.name}
                                                </div>
                                            </>
                                        }
                                    </div>
                                ))}
                            </div>
                            : <div className="flex min-w-0 items-center gap-1.5">
                                <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${bitcoin?.id}.png`} alt={bitcoin?.name} width={24} height={24} className="h-5 w-5 shrink-0 rounded-full" />
                                <div className="shrink-0 pr-1.5 font-Manrope font-bold tracking-wider sm:pr-2.5">{bitcoin?.symbol}</div>
                                <div className="truncate text-sm font-light text-lnd-fg-muted">{bitcoin?.name}</div>
                            </div>
                        }
                        <ChevronDown className="h-5 w-5 shrink-0 text-lnd-accent opacity-50 transition-all duration-300 dark:text-lnd-fg-muted" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] max-w-[550px] border-none p-0 shadow shadow-black/50 dark:bg-lnd-surface dark:shadow-black/90">
                    <Command className="space-y-4 pb-1 pt-4">
                        <CommandInput className="rounded-md placeholder:text-sm placeholder:text-lnd-fg-muted dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg dark:placeholder:text-lnd-fg-muted" placeholder="Search by coin/token" />
                        <div className="flex flex-col gap-3 px-4">
                            <Label className="flex items-center justify-between dark:text-lnd-fg">
                                <span>History</span>
                                <BiTrash className="dark:text-lnd-fg" />
                            </Label>
                            <div className="flex gap-2 sm:gap-3">
                                <Button onClick={() => setValue("Tether USDt")} className="rounded-[1.25rem] bg-lnd-surface-2 px-5 py-[.22rem] text-sm text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg dark:hover:bg-lnd-surface-2 sm:px-8">USDT</Button>
                                <Button onClick={() => setValue("Bitcoin")} className="rounded-[1.25rem] bg-lnd-surface-2 px-5 py-[.22rem] text-sm text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg dark:hover:bg-lnd-surface-2 sm:px-8">BTC</Button>
                            </div>
                        </div>
                        <Label className="px-4 dark:text-lnd-fg">Crypto List</Label>
                        <div className="h-[200px] w-full overflow-hidden">
                            <ScrollArea className="h-full w-full">
                                <CommandList className="h-auto w-auto">
                                    <CommandEmpty>No data found.</CommandEmpty>
                                    {cryptoData?.data?.data?.map((crypto: CryptoCurrency) => (
                                        <CommandItem
                                            key={crypto?.name}
                                            value={crypto?.name}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                            className="rounded-none border-b py-2.5 last:border-0 dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg dark:hover:bg-lnd-surface-2"
                                        >
                                            <div className="flex w-full min-w-0 items-center">
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto?.id}.png`} alt={crypto?.name} width={24} height={24} className="h-5 w-5 rounded-full" />
                                                    <div className="w-20 font-Manrope font-semibold tracking-wider dark:text-lnd-fg">{crypto?.symbol}</div>
                                                </div>
                                                <div className="min-w-0 flex-1 truncate text-sm font-normal text-lnd-fg-muted dark:text-lnd-fg-muted">{crypto?.name}</div>
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