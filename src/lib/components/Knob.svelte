<script lang="ts" generics="T">
    import { cn } from '$lib/utils/cn';
    import Tooltip from './Tooltip.svelte';
    import { Info } from 'lucide-svelte';

    let {
        label,
        value,
        options,
        format = (v: T) => String(v),
        tooltip,
        onChange
    } = $props<{
        label: string;
        value: T;
        options: T[];
        format?: (v: T) => string;
        tooltip?: string;
        onChange?: (v: T) => void;
    }>();

    function next() {
        const idx = options.indexOf(value);
        if (idx < options.length - 1) {
            onChange?.(options[idx + 1]);
        }
    }

    function prev() {
        const idx = options.indexOf(value);
        if (idx > 0) {
            onChange?.(options[idx - 1]);
        }
    }
</script>

<div class="flex flex-col w-full select-none">
    <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-1.5">
            <span class="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{label}</span>
            {#if tooltip}
                <Tooltip text={tooltip}>
                    <Info class="w-3 h-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors cursor-help" />
                </Tooltip>
            {/if}
        </div>
        <span class="font-mono text-sm text-zinc-900 dark:text-zinc-100">{format(value)}</span>
    </div>

    <div class="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <button
            class="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-zinc-200 dark:border-zinc-800"
            onclick={prev}
            disabled={value === options[0]}
        >
            -
        </button>

        <div class="flex-1 h-8 flex items-center justify-center relative overflow-hidden group cursor-ew-resize">
            <!-- Visual indicator bar could go here -->
            <div class="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 origin-left transition-transform duration-200" style="transform: scaleX({(options.indexOf(value) + 1) / options.length})"></div>
            <span class="relative z-10 text-xs font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{format(value)}</span>
        </div>

        <button
            class="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-zinc-200 dark:border-zinc-800"
            onclick={next}
            disabled={value === options[options.length - 1]}
        >
            +
        </button>
    </div>
</div>
