<script>
	export let podcastInfoPage = 'required';
</script>

<ul>
	<li
		on:click={() => {
			podcastInfoPage = 'required';
		}}
		class:active={podcastInfoPage === 'required'}
	>
		Required Info
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'showArt';
		}}
		class:active={podcastInfoPage === 'showArt'}
	>
		Show Art
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'showInfo';
		}}
		class:active={podcastInfoPage === 'showInfo'}
	>
		Show Info
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
			podcastInfoPage = 'images';
		}}
		class:active={podcastInfoPage === 'person'}
	>
		Cast
	</li>
	<li
		on:click={() => {
			podcastInfoPage = 'person';
		}}
		class:active={podcastInfoPage === 'person'}
	>
		Cast
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
