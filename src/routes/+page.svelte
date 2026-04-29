<script>
    import { onMount } from "svelte";
    import BiomorphCanvas from "$lib/BiomorphCanvas.svelte";
    import { randomGenome, createChildren } from "$lib/biomorph.js";

    let parent = $state(randomGenome());
    let children = $state(createChildren(parent));
    let generation = $state(1);
    let history = $state([]);
    let cellSize = $state(180);
    let selectSize = $state(140);

    const GRID = [0, 1, 2, 3, null, 4, 5, 6, 7];

    let selecting = $state(true);
    let candidates = $state(Array.from({ length: 12 }, () => randomGenome()));

    function selectChild(childIndex) {
        history = [...history, { genes: [...parent], generation }];
        parent = [...children[childIndex]];
        children = createChildren(parent);
        generation += 1;
    }

    function reroll() {
        children = createChildren(parent);
    }

    function goBack() {
        if (!history.length) return;
        const prev = history[history.length - 1];
        history = history.slice(0, -1);
        parent = [...prev.genes];
        generation = prev.generation;
        children = createChildren(parent);
    }

    function startSelection() {
        candidates = Array.from({ length: 12 }, () => randomGenome());
        selecting = true;
    }

    function pickCandidate(genome) {
        parent = [...genome];
        children = createChildren(parent);
        generation = 1;
        history = [];
        selecting = false;
    }

    function rerollCandidates() {
        candidates = Array.from({ length: 12 }, () => randomGenome());
    }

    onMount(() => {
        const update = () => {
            const vw = window.innerWidth;
            cellSize =
                vw < 640 ? Math.floor((vw - 40) / 3) : vw < 1000 ? 170 : 180;
            selectSize =
                vw < 640 ? Math.floor((vw - 40) / 4) : vw < 1000 ? 130 : 140;
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    });
</script>

<div
    style="
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 1.5rem;
  gap: 2rem;
  background: #0d0d0f;
  color: #e8e8f0;
"
>
    <header
        style="
    width: 100%; max-width: 600px;
    display: flex; justify-content: space-between;
    align-items: flex-start; flex-wrap: wrap; gap: 1rem;
  "
    >
        <div>
            <h1
                style="
        font-family: 'DM Sans', sans-serif;
        font-size: 1.9rem; font-weight: 600;
        letter-spacing: -.03em; margin: 0;
      "
            >
                biomorphs
            </h1>
            <p style="margin: .25rem 0 0; font-size: 1rem; color: #5a5a70;">
                {#if selecting}
                    <span
                        style="font-family:'JetBrains Mono',monospace; color:#7cffd488;"
                        >create a creature</span
                    >
                {:else}
                    <span style="font-family:'JetBrains Mono',monospace;"
                        >gen {generation}</span
                    >
                {/if}
            </p>
        </div>

        <div style="display: flex; gap: .5rem; align-items: center;">
            {#if selecting}
                <button
                    onclick={rerollCandidates}
                    style="font-family:'JetBrains Mono',monospace; font-size:.75rem;
                   padding:.45rem 1rem; border-radius:6px; cursor:pointer;
                   border:1px solid #7cffd455; background:#7cffd411; color:#7cffd4;
                   transition:all .15s;">reroll</button
                >
            {:else}
                <button
                    onclick={reroll}
                    style="font-family:'JetBrains Mono',monospace; font-size:.75rem;
                   padding:.45rem 1rem; border-radius:6px; cursor:pointer;
                   border:1px solid #2a2a32; background:#141417; color:#aaaacc;
                   transition:all .15s;">reroll</button
                >

                <button
                    onclick={goBack}
                    disabled={!history.length}
                    style="font-family:'JetBrains Mono',monospace; font-size:.75rem;
                   padding:.45rem 1rem; border-radius:6px; cursor:pointer;
                   border:1px solid #2a2a32; background:#141417; color:#aaaacc;
                   opacity:{history.length ? 1 : 0.3}; transition:all .15s;"
                    >← back</button
                >

                <button
                    onclick={startSelection}
                    style="font-family:'JetBrains Mono',monospace; font-size:.75rem;
                   padding:.45rem 1rem; border-radius:6px; cursor:pointer;
                   border:1px solid #7cffd455; background:#7cffd411; color:#7cffd4;
                   transition:all .15s;">new</button
                >
            {/if}
        </div>
    </header>

    {#if selecting}
        <main>
            <div
                style="
          display: grid;
          grid-template-columns: repeat(4, {selectSize}px);
          grid-template-rows: repeat(3, auto);
          gap: 8px;
        "
            >
                {#each candidates as genome, i (i)}
                    <div
                        style="display: flex; flex-direction: column; align-items: center; gap: 4px;"
                    >
                        <BiomorphCanvas
                            genes={genome}
                            size={selectSize}
                            onclick={() => pickCandidate(genome)}
                        />
                        <span
                            style="
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.55rem;
                    color: #4a4a6a;
                    text-align: center;
                    word-break: break-all;
                    max-width: {selectSize}px;
                    line-height: 1.5;
                  "
                        >
                            {genome.join(" ")}
                        </span>
                    </div>
                {/each}
            </div>

            <p
                style="
          margin-top: 1.5rem;
          margin-left: auto;
          margin-right: auto;
          font-size: .95rem;
          color: #6a6a88;
          text-align: center;
          max-width: 480px;
          line-height: 1.7;
          letter-spacing: 0.01em;
        "
            >
                Click any creature to start
            </p>
        </main>
    {:else}
        <main>
            <div
                style="
          display: grid;
          grid-template-columns: repeat(3, {cellSize}px);
          grid-template-rows: repeat(3, {cellSize}px);
          gap: 8px;
        "
            >
                {#each GRID as slot, i (i)}
                    {#if slot === null}
                        <BiomorphCanvas
                            genes={parent}
                            isParent={true}
                            size={cellSize}
                            onclick={reroll}
                        />
                    {:else}
                        <BiomorphCanvas
                            genes={children[slot]}
                            size={cellSize}
                            onclick={() => selectChild(slot)}
                        />
                    {/if}
                {/each}
            </div>

            <p
                style="
          margin-top: 1.5rem;
          margin-left: auto;
          margin-right: auto;
          font-size: .95rem;
          color: #6a6a88;
          text-align: center;
          max-width: 480px;
          line-height: 1.7;
          letter-spacing: 0.01em;
        "
            >
                Click any surrounding biomorph to evolve it. Click the <span
                    style="color:#7cffd4;">center</span
                > to reroll children.
            </p>
        </main>

        <footer
            style="
      margin-top: auto; padding-top: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: .85rem; color: #4a4a6a;
      word-break: break-all; max-width: 580px; text-align: center;
    "
        >
            [{parent.join(", ")}]
        </footer>
    {/if}
</div>
