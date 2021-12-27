<script>
  export let size = '1em';
  export let width = size;
  export let height = size;
  export let color = 'currentColor';
  export let viewBox = '0 0 24 24';
</script>

<svg {width} {height} {viewBox}>
  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={color} />
</svg>
