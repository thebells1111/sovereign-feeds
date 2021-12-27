<script>
  import { showFFCreator } from '$/stores';
</script>

<button on:click={() => ($showFFCreator = true)}
  ><p>Create</p>
  <img src="/ff.webp" />
  <p>Fast Follow</p></button
>

<style>
  button {
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: none;
    height: 36px;
    min-width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 24px;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 0.6em;
  }
</style>
