<script>
    import { onMount } from "svelte";
    import { drawBiomorph } from "$lib/biomorph.js";

    let { genes, isParent = false, size = 180, onclick } = $props();

    let canvas = $state(null);
    let hovered = $state(false);

    function render() {
        if (!canvas || !genes) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.fillStyle = isParent ? "#081510" : hovered ? "#0f1820" : "#0d0d0f";
        ctx.fillRect(0, 0, size, size);
        const color = isParent ? "#7cffd4" : hovered ? "#a8ffe4" : "#4dc99a";
        drawBiomorph(ctx, genes, size, color);
    }

    $effect(() => {
        void genes;
        void size;
        void hovered;
        void isParent;
        render();
    });

    onMount(render);
</script>

<button
    {onclick}
    onmouseenter={() => {
        hovered = true;
    }}
    onmouseleave={() => {
        hovered = false;
    }}
    style="
    position: relative;
    width: {size}px;
    height: {size}px;
    border: 1px solid {isParent ? '#7cffd4' : hovered ? '#3d9970' : '#1e1e26'};
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    box-shadow: {isParent
        ? '0 0 28px #7cffd433'
        : hovered
          ? '0 0 14px #4dc99a22'
          : 'none'};
    transition: border-color 0.15s, box-shadow 0.15s;
  "
    aria-label={isParent
        ? "Parent biomorph — click to reroll"
        : "Select this biomorph"}
>
    <canvas bind:this={canvas}></canvas>
    {#if isParent}
        <span
            style="
      position: absolute; bottom: 6px; left: 50%;
      transform: translateX(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; letter-spacing: .15em;
      text-transform: uppercase; color: #7cffd488;
      pointer-events: none;
    ">parent</span
        >
    {/if}
</button>
