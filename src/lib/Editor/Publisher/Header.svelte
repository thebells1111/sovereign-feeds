<script>
	export let podcastInfoPage = 'showInfo';
</script>

<ul>
	<li
		on:click={() => {
			podcastInfoPage = 'showInfo';
		}}
		class:active={podcastInfoPage === 'showInfo'}
	>
		Feed Info
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'showArt';
		}}
		class:active={podcastInfoPage === 'showArt'}
	>
		Feed Art
	</li>

	<li
		on:click={() => {
			podcastInfoPage = 'feedList';
		}}
		class:active={podcastInfoPage === 'feedList'}
	>
		Feed List
	</li>

	<li
		on:click={() => {
			podcastInfoPage = 'ownerInfo';
		}}
		class:active={podcastInfoPage === 'ownerInfo'}
	>
		Owner Info
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'support';
		}}
		class:active={podcastInfoPage === 'support'}
	>
		Support Links
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'value';
		}}
		class:active={podcastInfoPage === 'value'}
	>
		Value
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'person';
		}}
		class:active={podcastInfoPage === 'person'}
	>
		Feed Cast
	</li>

	<li
		on:click={() => {
			podcastInfoPage = 'block';
		}}
		class:active={podcastInfoPage === 'block'}
	>
		Block
	</li>

	<li
		on:click={() => {
			podcastInfoPage = 'podroll';
		}}
		class:active={podcastInfoPage === 'podroll'}
	>
		Podroll
	</li>
</ul>

<style>
	ul {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	li {
		list-style: none;
		padding: 4px 16px;
		margin: 4px 0;
		cursor: pointer;
		font-weight: 600;
	}

	.active {
		color: rgb(27, 111, 246);
		border-bottom: 2px solid rgb(27, 111, 246);
	}
</style>
