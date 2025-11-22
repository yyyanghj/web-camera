<script lang="ts">
    import { fade } from 'svelte/transition';

    let { text, children } = $props<{
        text: string;
        children: any;
    }>();

    let isHovered = $state(false);
    let triggerEl: HTMLElement;
    let coords = $state({ top: 0, left: 0 });

    function handleMouseEnter() {
        if (triggerEl) {
            const rect = triggerEl.getBoundingClientRect();
            coords = {
                top: rect.top,
                left: rect.left + rect.width / 2
            };
            isHovered = true;
        }
    }
</script>

<div
    class="relative inline-block"
    bind:this={triggerEl}
    onmouseenter={handleMouseEnter}
    onmouseleave={() => isHovered = false}
    role="tooltip"
>
    {@render children()}

    {#if isHovered}
        <div
            transition:fade={{ duration: 150 }}
            class="fixed px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded shadow-lg z-[9999] pointer-events-none max-w-[200px] whitespace-normal text-center"
            style="top: {coords.top - 8}px; left: {coords.left}px; transform: translate(-50%, -100%);"
        >
            {text}
            <!-- Arrow -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100"></div>
        </div>
    {/if}
</div>
