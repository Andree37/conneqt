'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

type SelectOption = Record<'value' | 'label', string>;

type MultiSelectProps = {
    options: SelectOption[];
    onValueChange?: (values: SelectOption[]) => void;
    disabled?: boolean;
};

export default function MultiSelect({ options, onValueChange, disabled }: MultiSelectProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<SelectOption[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleUnselect = useCallback((selectOption: SelectOption) => {
        setSelected((prev) => prev.filter((s) => s.value !== selectOption.value));
    }, []);

    useEffect(() => {
        onValueChange?.(selected);
    }, [selected]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (input.value === '') {
                    setSelected((prev) => {
                        const newSelected = [...prev];
                        newSelected.pop();
                        return newSelected;
                    });
                }
            }
            if (e.key === 'Escape') {
                input.blur();
            }
        }
    }, []);

    const selectables = options.filter((option) => !selected.includes(option));

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex gap-1 flex-wrap">
                    {selected.map((option) => {
                        return (
                            <Badge key={option.value} variant="secondary">
                                {option.label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(option)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <CommandPrimitive.Input
                        disabled={disabled}
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select GPU Models..."
                        className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && selectables.length > 0 ? (
                    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto">
                            {selectables.map((option) => {
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue('');
                                            setSelected((prev) => [...prev, option]);
                                        }}
                                        className={'cursor-pointer'}
                                    >
                                        {option.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </div>
                ) : null}
            </div>
        </Command>
    );
}
