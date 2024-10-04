<main class="container">
  <div class="item">
    <i class="loader" />
  </div>
</main>

<style>
  .loader {
    --color: black;
    --size-dot: 32px;
    --size-bar: 1px;

    display: block;
    position: relative;
    width: 50%;
    display: grid;
    place-items: center;
    opacity: 0;
    bottom: 0;
    animation: loader-1 0.8s cubic-bezier(0.46, -0.1, 0.27, 1.07) 0.2s infinite;
  }

  .loader::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
  }

  .loader::after {
    width: var(--size-dot);
    height: var(--size-dot);
    border-radius: 50%;
    background-color: var(--color);
  }

  @keyframes loader-1 {
    0%,
    100% {
      opacity: 0;
    }

    0% {
      transform: scale(0);
    }

    33% {
      opacity: 0.3;
    }

    60% {
      opacity: 0.3;
    }

    100% {
      transform: scale(4);
    }
  }

  /**
	miscs
**/

  .container {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item {
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    place-items: center;
    border-radius: 4px;
    transition: opacity 0.4s ease;
  }

  .container:hover .item {
    opacity: 0.3;
  }

  .container:hover .item:hover {
    opacity: 1;
  }
</style>
