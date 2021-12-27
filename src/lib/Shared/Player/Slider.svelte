<script>
  let element;
  export let handleChange;
  export let value = 1;
  export let hideSlider = false;
  export let min = 0;
  export let max = 100;
  export let step = 1;
</script>

<input
  aria-label="Volume"
  class:hide={hideSlider}
  type="range"
  {min}
  {max}
  {step}
  bind:this={element}
  bind:value
  on:change={handleChange}
/>

<style>
  .hide {
    display: none;
  }

  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    padding: 0.75em 0;
    border: none;
    cursor: pointer;
    background-color: transparent;
    margin: 0 2px;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #dddddd;
  }
  input[type='range']::-webkit-slider-thumb {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background: #333;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3px;
  }
  input[type='range']:focus::-webkit-slider-runnable-track {
    background: #eaeaea;
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #dddddd;
  }
  input[type='range']::-moz-range-thumb {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background: #0000ff;
    cursor: pointer;
  }
  input[type='range']::-ms-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: #dddddd;
  }
  input[type='range']::-ms-fill-upper {
    background: #dddddd;
  }
  input[type='range']::-ms-thumb {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background: #0000ff;
    cursor: pointer;
    height: 2px;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: #dddddd;
  }
  input[type='range']:focus::-ms-fill-upper {
    background: #dddddd;
  }
</style>
