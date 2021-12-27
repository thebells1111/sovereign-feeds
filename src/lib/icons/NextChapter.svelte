<script>
  export let size = '1em';
  export let width = size;
  export let height = size;
  export let color = 'currentColor';
  export let viewBox = '0 0 24 24';
</script>

<svg {width} {height} {viewBox}>
  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" fill={color} />
</svg>
