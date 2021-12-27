<script>
	import { selectedEpisode, showNotesVerticalSwiper } from '$/stores';
	// import DOMPurify from 'isomorphic-dompurify';

	let persons = [];

	$: if ($selectedEpisode) {
		persons = [];
		let p = false;
		if ($selectedEpisode.podcastPerson) {
			p = true;
			if ($selectedEpisode.podcastPerson.length) {
				persons = $selectedEpisode.podcastPerson;
			} else {
				persons = [$selectedEpisode.podcastPerson];
			}
		}

		if (p) {
			let temp = [];
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					temp = $selectedEpisode.person;
				} else {
					temp = [$selectedEpisode.person];
				}

				for (let p of persons) {
					if (temp.findIndex(({ img }) => img === p.img) === -1) {
						temp.push(p);
					}
				}
				persons = [...temp];
			}
		} else {
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					persons = $selectedEpisode.person;
				} else {
					persons = [$selectedEpisode.person];
				}
			}
		}
	}

	function handleImgError(e) {
		let elem = e.target;
		elem.parentNode.removeChild(elem);
	}

	let yScroll = 0;
	let yPosStart;
	let scrollTopStart;
</script>

<section>
	{#if $selectedEpisode && $selectedEpisode.description}
		<div
			class="show-notes"
			on:scroll={(e) => {
				yScroll = e.target.scrollTop;
			}}
			on:touchstart={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				yPosStart = touch.pageY;
				$showNotesVerticalSwiper.allowTouchMove = false;
				scrollTopStart = yScroll;
			}}
			on:touchmove={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				if (scrollTopStart === 0 && yPosStart < touch.pageY) {
					$showNotesVerticalSwiper.allowTouchMove = true;
				}
			}}
			on:touchend={() => {
				$showNotesVerticalSwiper.allowTouchMove = true;
			}}
		>
			<!-- <div class="persons">
        {#each persons as person}
          <div>
            <img
              class="person-img"
              src={person.img}
              on:error={(e) => handleImgError(e)}
            />
            <p>{`${person.role}: ${person['#text']}`}</p>
          </div>
        {/each}
      </div> -->

			<div class="description">
				{@html typeof $selectedEpisode.description === 'string'
					? $selectedEpisode.description
							.trim()
							.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, '')
							.replace(/<audio[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, '')
							.replace(/<video[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, '')
							.replace(/<source[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, '')
							.replace(/<p>\s*<\/p>/g, '')
					: // .replace(
					  // 	/(([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?)/gs,
					  // 	'<a href=\'#\' class="timestampLink">$1</a>'
					  // )
					  ''}
			</div>
		</div>
	{/if}
</section>

<style>
	head {
		display: flex;
	}

	.show-notes {
		padding-right: 8px;
		height: 100%;
		overflow: auto;
	}

	section {
		height: 100%;
	}

	.description {
		word-wrap: break-word;
		display: flex;
		flex-direction: column;
	}

	h3 {
		min-height: 50px;
		margin: 0;
		text-align: center;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
	}

	:global(.shownotes-load-episode-button:hover > svg) {
		color: #111;
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
