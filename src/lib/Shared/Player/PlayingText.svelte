<script>
  import { playingEpisode, isPlayerLoaded, playingPodcast } from '$/stores';
</script>

<div class="playing-text">
  {$playingPodcast?.title && $playingEpisode?.title
    ? `${$playingPodcast.title} - ${$playingEpisode.title}`
    : 'CurioCaster - The Best Podcast Player in Texas'}
</div>

<style>
  .playing-text {
    position: absolute;
    z-index: -1;
    top: 25px;
    text-align: center;
  }
</style>
