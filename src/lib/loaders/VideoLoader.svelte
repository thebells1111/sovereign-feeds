<div class="container">
  <div class="item">
    <i class="loader loader--6" />
    <p>Player Loading</p>
  </div>
</div>

<style>
  .loader {
    --loader-size: calc(var(--block-size) / 2);
    --loader-size-half: calc(var(--loader-size) / 2);
    --loader-size-half-neg: calc(var(--loader-size-half) * -1);
    --light-color: rgba(255, 255, 255, 0.3);
    --dot-size: 5px;
    --dot-size-half: calc(var(--dot-size) / 2);
    --dot-size-half-neg: calc(var(--dot-size-half) * -1);

    display: block;
    position: relative;
    width: var(--loader-size);
    display: grid;
    place-items: center;
    color: white;
  }

  .loader::before,
  .loader::after {
    content: '';
    position: absolute;
  }

  /**
	loader--6
**/
  .loader--6 {
    --loader-size: calc(var(--block-size) / 3);
    --anim-duration: 0.6s;
    aspect-ratio: 1 / 1;
    perspective: 50vmin;
    transform-style: preserve-3d;
    transform: rotateX(35deg);
  }

  .loader--6::before,
  .loader--6::after {
    width: 50%;
    aspect-ratio: 1 / 1;
    background-color: black;
    top: 25%;
    left: 25%;
    animation: loader-6 var(--anim-duration)
      cubic-bezier(0.07, 0.59, 0.56, 0.88) infinite;
  }

  .loader--6::before {
    --turn-deg: -60deg;
    --x-dist: -25%;
    transform-origin: left calc(var(--loader-size) * -1);
  }

  .loader--6::after {
    --turn-deg: 60deg;
    --x-dist: 25%;
    transform-origin: right calc(var(--loader-size) * -1);
    animation-delay: calc(var(--anim-duration) / 2 * -1);
  }

  @keyframes loader-6 {
    0% {
      transform: scale(0.3) translateZ(-15vmin)
        rotateY(calc(var(--turn-deg) * -1));
    }

    0%,
    100% {
      opacity: 0;
    }

    33% {
      opacity: 0.8;
      transform: scale(1.2) translateZ(5vmin) translateX(var(--x-dist));
    }

    100% {
      transform: scale(1.2) translateZ(5vmin) translateX(var(--x-dist))
        rotateY(var(--turn-deg));
    }
  }

  .container {
    --block-size: 320px;
    width: 320px;
    height: 320px;
    margin: auto;
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
