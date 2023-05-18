<script>
	import Select from 'svelte-select';
	import { blankPerson, digitalOceanEnabled, editingEpisode } from '$/editor';
	import { groups, roles } from '$/podcastPerson';
	import Image from '$functions/Image.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import Upload from '$lib/Upload/Upload.svelte';

	import clone from 'just-clone';

	export let data = [];
	export let type;
	export let standAlone = false;
	import {
		selectedChannelPersonGroups,
		selectedChannelPersonRoles,
		selectedEpisodePersonGroups,
		selectedEpisodePersonRoles
	} from '$/editor';

	let selectedPersonGroups = [];
	let selectedPersonRoles = [];

	$: if (type === 'episode') {
		selectedPersonGroups = $selectedEpisodePersonGroups;
		selectedPersonRoles = $selectedEpisodePersonRoles;
	} else {
		selectedPersonGroups = $selectedChannelPersonGroups;
		selectedPersonRoles = $selectedChannelPersonRoles;
	}

	let index = 0;

	function changeGroup(e) {
		selectedPersonGroups[index] = e.detail.value;
		data[index]['@_group'] = e.detail.value;
		selectedPersonRoles[index] = undefined;
		data[index]['@_role'] = selectedPersonRoles[index];
	}

	function changeRole(e) {
		selectedPersonRoles[index] = e.detail.value;
		data[index]['@_role'] = selectedPersonRoles[index];
	}

	let showUpload = false;
	let fileName;
	$: if (fileName) {
		data[index]['@_img'] = fileName;
		fileName = '';
	}
</script>

<div class="persons-container" style={standAlone ? 'width:100%' : ''}>
	<div class="cast-container">
		{#each data as person, i}
			<div
				class="cast-member"
				on:click={() => {
					index = i;
				}}
			>
				<div>
					<Image
						src={person?.['@_img'] || `${window.location.origin}/blank-person.png`}
						style={'width:75px'}
						errorImg={`${window.location.origin}/blank-person.png`}
					/>
				</div>
				<div class="cast-name">
					{person?.['#text']}
				</div>

				<div
					class="delete"
					on:click|stopPropagation={() => {
						let text = `Are you sure you want to delete ${person['#text']}?`;
						if (confirm(text) == true) {
							data.splice(i, 1);
							if (index === data.length) {
								index--;
							}

							if (data.length === 0) {
								index = 0;
								let blank = clone(blankPerson);
								data = [blank];
							}
							console.log(data);

							data = data;
						}
					}}
				>
					<Delete />
				</div>
			</div>
		{/each}
		<div
			class="add-new-cast"
			on:click={() => {
				let blank = clone(blankPerson);
				blank['#text'] = `Person ${data.length + 1}`;
				data.push(clone(blank));
				index = data.length - 1;
				data = data;
			}}
		>
			+
		</div>
	</div>
	{#if type === 'podcast'}
		<p>These are for people that are consistent for every podcast, i.e. hosts</p>
	{:else if type === 'episode'}
		<p>These are for people that are in the episode only, i.e. guests</p>
	{/if}
	<div class="person-header" />
	<div class="person-blocks-container">
		{#if data}
			{#if data && data?.length > 0}
				<div class="person-block">
					<label>
						<h4>Person</h4>
						<input
							type="text"
							bind:value={data[index]['#text']}
							class:episode-color={type === 'episode'}
						/>
					</label>
					<div class="role-container">
						<div class="role-select-container">
							<label style="width: 100%">
								<h4>Group</h4>
								<!-- svelte-ignore a11y-no-onchange -->
								<Select
									items={groups}
									value={selectedPersonGroups[index]}
									isCreatable={true}
									on:select={changeGroup}
								/>
							</label>

							<label style="width: 100%">
								<h4>Role</h4>
								<Select
									items={roles[selectedPersonGroups[index]] || []}
									value={selectedPersonRoles[index]}
									isCreatable={true}
									on:select={changeRole}
								/>
							</label>
						</div>
						<div class="image-container">
							<Image
								src={data[index]['@_img'] || `${window.location.origin}/blank-person.png`}
								style={'width:75px'}
								errorImg={`${window.location.origin}/blank-person.png`}
							/>
						</div>
					</div>

					<div class="image-link">
						<label>
							<h4>Image Link</h4>
							<input
								type="text"
								bind:value={data[index]['@_img']}
								class:episode-color={type === 'episode'}
							/>
						</label>
						{#if $digitalOceanEnabled}
							<button
								class="upload"
								on:click={() => {
									showUpload = true;
								}}
							>
								Upload
							</button>
						{/if}
					</div>
					<label>
						<h4>Website</h4>
						<input
							type="text"
							bind:value={data[index]['@_href']}
							class:episode-color={type === 'episode'}
						/>
					</label>
				</div>
			{/if}
		{/if}
	</div>
	<!-- <IndexScroll bind:data bind:index blank={blankPerson} /> -->
</div>

{#if showUpload}
	<Upload
		path={`${type === 'episode' ? `${$editingEpisode.title}/` : ''}person`}
		bind:fileName
		bind:showUpload
	/>
{/if}

<style>
	.cast-container {
		width: 100%;
		display: flex;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	.cast-member {
		margin: 0 8px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		text-align: center;
		cursor: pointer;
		position: relative;
	}

	.cast-name {
		height: 21px;
	}

	.delete {
		background-color: white;
		width: 1.2em;
		height: 1.2em;
		border-radius: 1.2em;
		display: grid;
		place-content: center;
		position: absolute;
		bottom: 16px;
		right: -9px;
	}

	.add-new-cast {
		min-width: 75px;
		min-height: 75px;
		border: 1px solid black;
		border-radius: 75px;
		font-size: 3em;
		align-self: center;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}

	.persons-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
	}
	.person-blocks-container {
		overflow: auto;
	}
	.person-block {
		margin-bottom: 16px 0;
	}
	p {
		text-align: center;
	}
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 43.7%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}
	input:focus {
		outline: none;
		border: 1px solid black;
	}

	.role-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		--background: transparent;
		--borderFocusColor: black;
	}

	.role-select-container {
		flex-grow: 1;
		margin-right: 16px;
	}

	.person-header {
		width: 100%;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-link {
		display: flex;
		align-items: flex-end;
	}

	.upload {
		height: 27px;
		min-width: 75px;
		background-color: #333;
		margin: 0 0 16px 16px;
		color: #eee;
		padding: 2px 8px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
	}
</style>
