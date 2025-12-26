<script lang="ts" generics="T">
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
            <span class="text-[10px] uppercase tracking-widest text-text-secondary font-mono">{label}</span>
            {#if tooltip}
                <Tooltip text={tooltip}>
                    <Info class="w-3 h-3 text-text-secondary hover:text-text-primary transition-colors cursor-help" />
                </Tooltip>
            {/if}
        </div>
        <span class="font-mono text-sm text-text-primary">{format(value)}</span>
    </div>

    <div class="flex items-center border border-border-primary bg-bg-secondary">
        <button
            class="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-border-primary"
            onclick={prev}
            disabled={value === options[0]}
        >
            -
        </button>

        <div class="flex-1 h-8 flex items-center justify-center relative overflow-hidden group cursor-ew-resize">
            <!-- Visual indicator bar could go here -->
            <div class="absolute inset-0 bg-border-secondary origin-left transition-transform duration-200" style="transform: scaleX({(options.indexOf(value) + 1) / options.length})"></div>
            <span class="relative z-10 text-xs font-mono text-text-secondary group-hover:text-text-primary transition-colors">{format(value)}</span>
        </div>

        <button
            class="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-border-primary"
            onclick={next}
            disabled={value === options[options.length - 1]}
        >
            +
        </button>
    </div>
</div>
