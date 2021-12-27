<script>
	import parseSRT from 'parse-srt';
	import VirtualList from 'svelte-tiny-virtual-list';

	import convertTime from '$functions/convertTime';

	import {
		selectedEpisode,
		playingEpisode,
		player,
		playerTime,
		selectedEpisodeTranscript,
		transcriptIndex,
		chapterIndex,
		playingEpisodeTranscript,
		showNotesVerticalSwiper
	} from '$/stores';

	let transcriptOffset = 0;

	// $rightPane = 'transcripts';

	async function getTranscript(transcriptSRT) {
		console.log(transcriptSRT.url);
		let res = await fetch(`/api/httpsproxy?url=` + transcriptSRT.url);
		if (res.status === 200) {
			let text = await res.text();
			let transcript = parseSRT(text);
			let t = transcript
				.map((v) => v.text)
				.join(' ')
				.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ');

			transcript.full = t.split('|-|').join(' ');
			$selectedEpisodeTranscript = transcript;
			if ($selectedEpisode.title === $playingEpisode.title) {
				$playingEpisodeTranscript = transcript;
			}
		} else {
			$selectedEpisodeTranscript = null;
			filteredTranscript = null;
		}
	}

	$: if ($selectedEpisode && $selectedEpisode.transcripts) {
		const transcriptSRT = $selectedEpisode.transcripts?.find(
			({ type }) => type === 'application/srt'
		);

		if (transcriptSRT?.url) {
			getTranscript(transcriptSRT);
		} else {
			$selectedEpisodeTranscript = null;
			filteredTranscript = null;
		}
	} else {
		$selectedEpisodeTranscript = null;
		filteredTranscript = null;
	}

	function jumpToSection(section, index) {
		if ($playingEpisode.id === $selectedEpisode.id) {
			if (section.start) {
				$playerTime = section.start;
				$player.currentTime($playerTime);
				$chapterIndex = $chapterIndex;
				$transcriptIndex = index;
			}
		}
	}

	let listHeight = 0;
	let scrollToAlignment = 'start';
	let scrollToIndex = undefined;
	$: if (
		$playingEpisode?.id === $selectedEpisode?.id &&
		$transcriptIndex &&
		scrollStatus === 'Enabled'
	) {
		scrollToIndex = $transcriptIndex;
	}

	let transcriptSearchQuery = '';
	$: filteredTranscript = $selectedEpisodeTranscript;
	let scrollStatus = 'Enabled';

	let currentIndex = 0;
	let filteredIndices = [];

	function searchTranscripts() {
		if (transcriptSearchQuery) {
			scrollStatus = 'Disabled';
			currentIndex = 0;
			filteredIndices = getAllIndexes($selectedEpisodeTranscript, transcriptSearchQuery);
			if (filteredIndices.length > 0) {
				scrollToIndex = filteredIndices[0];
				scrollToAlignment = 'center';
			}
		} else {
			currentIndex = 0;
			scrollToIndex = $transcriptIndex || 0;
			filteredIndices = [];
			scrollToAlignment = 'start';
		}
		// console.log()
		// filteredTranscript = $selectedEpisodeTranscript.filter((v) =>
		//   v.text.toLowerCase().includes(transcriptSearchQuery.toLowerCase())
		// );

		function getAllIndexes(arr, val) {
			var indexes = [],
				i;
			for (i = 0; i < arr.length; i++)
				if (arr[i].text.toLowerCase().includes(val.toLowerCase())) {
					indexes.push(i);
				}
			return indexes;
		}
	}

	function handleScrollStatus() {
		scrollStatus = scrollStatus === 'Enabled' ? 'Disabled' : 'Enabled';
	}

	function getNextIndex() {
		currentIndex++;
		if (currentIndex === filteredIndices.length) {
			currentIndex = 0;
		}
		scrollToIndex = filteredIndices[currentIndex];
	}
	function getPreviousIndex() {
		currentIndex--;
		if (currentIndex === -1) {
			currentIndex = filteredIndices.length - 1;
		}
		scrollToIndex = filteredIndices[currentIndex];
	}

	function handleClear() {
		currentIndex = 0;
		filteredIndices = [];
		scrollToAlignment = 'start';
		scrollToIndex = $transcriptIndex || 0;
		transcriptSearchQuery = '';
		scrollStatus = 'Enabled';
	}

	let yPosStart = 0;
</script>

<div class="search-container">
	<label>
		<input
			bind:value={transcriptSearchQuery}
			on:input={searchTranscripts}
			placeholder="Search Transcript"
		/>
	</label>
	{#if transcriptSearchQuery}
		<button class="clear" on:click={handleClear}>X</button>
	{/if}
</div>
<div class="bar-2">
	<button class="scrolling" on:click={handleScrollStatus}>
		Scrolling {scrollStatus}
	</button>
	{#if filteredIndices.length > 0}
		<div class="index-select">
			<button class="previous" on:click={getPreviousIndex}>&#9664</button>
			<span>
				{currentIndex + 1} of {filteredIndices.length}
			</span>
			<button class="next" on:click={getNextIndex}>&#9654</button>
		</div>
	{/if}
</div>

{#if filteredTranscript?.length}
	<div
		class="list-height"
		bind:clientHeight={listHeight}
		on:touchstart={(e) => {
			let touch = e.touches[0] || e.changedTouches[0];
			yPosStart = touch.pageY;
			$showNotesVerticalSwiper.allowTouchMove = false;
		}}
		on:touchmove={(e) => {
			let touch = e.touches[0] || e.changedTouches[0];
			if (transcriptOffset === 0 && yPosStart < touch.pageY) {
				$showNotesVerticalSwiper.allowTouchMove = true;
			}
		}}
		on:touchend={() => {
			$showNotesVerticalSwiper.allowTouchMove = true;
		}}
	>
		<VirtualList
			height={listHeight}
			width="100%"
			itemCount={filteredTranscript.length}
			itemSize={50}
			overscanCount={5}
			on:afterScroll={(e) => (transcriptOffset = e.detail.offset)}
			{scrollToIndex}
			{scrollToAlignment}
		>
			<div
				slot="item"
				let:index
				let:style
				{style}
				class="row"
				class:active={(index === $transcriptIndex &&
					$playingEpisode?.id === $selectedEpisode?.id) ||
					index === filteredIndices[currentIndex]}
				on:click={jumpToSection.bind(this, filteredTranscript?.[index], index)}
			>
				<p class="transcript-text">
					{@html filteredTranscript?.[index].text || ''}
				</p>
				<p class="transcript-time">
					{convertTime(filteredTranscript?.[index].start) ?? ''}
				</p>
			</div>
		</VirtualList>
	</div>
{/if}

<style>
	.list-height {
		height: calc(100% - 72px);
	}

	div {
		display: flex;
	}
	div.active {
		font-weight: 700;
	}

	.search-container {
		width: 100%;
		height: 36px;
		display: block;
		position: relative;
	}

	.search-container > .clear {
		position: absolute;
		top: 0;
		right: 0;
	}

	.transcript-text {
		flex: 1 1 auto;
	}

	.transcript-time {
		padding-right: 8px;
	}

	input {
		width: calc(100% - 8px);
		margin: 0;
	}

	.bar-2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.index-select > span {
		width: 100px;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		margin: 0;
		color: var(--text-color);
		height: 36px;
		width: 36px;
		text-align: center;
	}
	.scrolling {
		width: auto;
	}

	.next {
		text-align: start;
	}
	.previous {
		text-align: end;
	}
</style>
