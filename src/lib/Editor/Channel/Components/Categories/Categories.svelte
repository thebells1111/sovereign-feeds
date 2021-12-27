<script>
	import { rssData } from '$/editor';
</script>

<label>
	<h3>Category (required)</h3>
	<select bind:value={$rssData['itunes:category']}>
		<option value="" disabled=""> Choose one option... </option>
		<option value="Arts"> Arts </option>
		<option value="Books">&nbsp;&nbsp;&nbsp;Books</option>
		<option value="Design">&nbsp;&nbsp;&nbsp;Design</option>
		<option value="Fashion &amp; Beauty">&nbsp;&nbsp;&nbsp;Fashion &amp; Beauty</option>
		<option value="Food">&nbsp;&nbsp;&nbsp;Food</option>
		<option value="Performing Arts">&nbsp;&nbsp;&nbsp;Performing Arts</option>
		<option value="Visual Arts">&nbsp;&nbsp;&nbsp;Visual Arts</option>
		<option value="Business">Business</option>
		<option value="Careers">&nbsp;&nbsp;&nbsp;Careers</option>
		<option value="Entrepreneurship">&nbsp;&nbsp;&nbsp;Entrepreneurship</option>
		<option value="Investing">&nbsp;&nbsp;&nbsp;Investing</option>
		<option value="Management">&nbsp;&nbsp;&nbsp;Management</option>
		<option value="Marketing">&nbsp;&nbsp;&nbsp;Marketing</option>
		<option value="Non-Profit">&nbsp;&nbsp;&nbsp;Non-Profit</option>
		<option value="Comedy">Comedy</option>
		<option value="Comedy Interviews">&nbsp;&nbsp;&nbsp;Comedy Interviews</option>
		<option value="Improv">&nbsp;&nbsp;&nbsp;Improv</option>
		<option value="Stand-Up">&nbsp;&nbsp;&nbsp;Stand-Up</option>
		<option value="Education">Education</option>
		<option value="Courses">&nbsp;&nbsp;&nbsp;Courses</option>
		<option value="How To">&nbsp;&nbsp;&nbsp;How To</option>
		<option value="Language Learning">&nbsp;&nbsp;&nbsp;Language Learning</option>
		<option value="Self-Improvement">&nbsp;&nbsp;&nbsp;Self-Improvement</option>
		<option value="Fiction">Fiction</option>
		<option value="Comedy Fiction">&nbsp;&nbsp;&nbsp;Comedy Fiction</option>
		<option value="Drama">&nbsp;&nbsp;&nbsp;Drama</option>
		<option value="Science Fiction">&nbsp;&nbsp;&nbsp;Science Fiction</option>
		<option value="Government">Government</option>
		<option value="History">History</option>
		<option value="Health &amp; Fitness">Health &amp; Fitness</option>
		<option value="Alternative Health">&nbsp;&nbsp;&nbsp;Alternative Health</option>
		<option value="Fitness">&nbsp;&nbsp;&nbsp;Fitness</option>
		<option value="Medicine">&nbsp;&nbsp;&nbsp;Medicine</option>
		<option value="Mental Health">&nbsp;&nbsp;&nbsp;Mental Health</option>
		<option value="Nutrition">&nbsp;&nbsp;&nbsp;Nutrition</option>
		<option value="Sexuality">&nbsp;&nbsp;&nbsp;Sexuality</option>
		<option value="Kids &amp; Family">Kids &amp; Family</option>
		<option value="Education for Kids">&nbsp;&nbsp;&nbsp;Education for Kids</option>
		<option value="Parenting">&nbsp;&nbsp;&nbsp;Parenting</option>
		<option value="Pets &amp; Animals">&nbsp;&nbsp;&nbsp;Pets &amp; Animals</option>
		<option value="Stories for Kids">&nbsp;&nbsp;&nbsp;Stories for Kids</option>
		<option value="Leisure">Leisure</option>
		<option value="Animation &amp; Manga">&nbsp;&nbsp;&nbsp;Animation &amp; Manga</option>
		<option value="Automotive">&nbsp;&nbsp;&nbsp;Automotive</option>
		<option value="Aviation">&nbsp;&nbsp;&nbsp;Aviation</option>
		<option value="Crafts">&nbsp;&nbsp;&nbsp;Crafts</option>
		<option value="Games">&nbsp;&nbsp;&nbsp;Games</option>
		<option value="Hobbies">&nbsp;&nbsp;&nbsp;Hobbies</option>
		<option value="Home &amp; Garden">&nbsp;&nbsp;&nbsp;Home &amp; Garden</option>
		<option value="Video Games">&nbsp;&nbsp;&nbsp;Video Games</option>
		<option value="Music">Music</option>
		<option value="Music Commentary">&nbsp;&nbsp;&nbsp;Music Commentary</option>
		<option value="Music History">&nbsp;&nbsp;&nbsp;Music History</option>
		<option value="Music Interviews">&nbsp;&nbsp;&nbsp;Music Interviews</option>
		<option value="News">News</option>
		<option value="Business News">&nbsp;&nbsp;&nbsp;Business News</option>
		<option value="Daily News">&nbsp;&nbsp;&nbsp;Daily News</option>
		<option value="Entertainment News">&nbsp;&nbsp;&nbsp;Entertainment News</option>
		<option value="News Commentary">&nbsp;&nbsp;&nbsp;News Commentary</option>
		<option value="Politics">&nbsp;&nbsp;&nbsp;Politics</option>
		<option value="Sports News">&nbsp;&nbsp;&nbsp;Sports News</option>
		<option value="Tech News">&nbsp;&nbsp;&nbsp;Tech News</option>
		<option value="Religion &amp; Spirituality">Religion &amp; Spirituality</option>
		<option value="Buddhism">&nbsp;&nbsp;&nbsp;Buddhism</option>
		<option value="Christianity">&nbsp;&nbsp;&nbsp;Christianity</option>
		<option value="Hinduism">&nbsp;&nbsp;&nbsp;Hinduism</option>
		<option value="Islam">&nbsp;&nbsp;&nbsp;Islam</option>
		<option value="Judaism">&nbsp;&nbsp;&nbsp;Judaism</option>
		<option value="Religion">&nbsp;&nbsp;&nbsp;Religion</option>
		<option value="Spirituality">&nbsp;&nbsp;&nbsp;Spirituality</option>
		<option value="Science">Science</option>
		<option value="Astronomy">&nbsp;&nbsp;&nbsp;Astronomy</option>
		<option value="Chemistry">&nbsp;&nbsp;&nbsp;Chemistry</option>
		<option value="Earth Sciences">&nbsp;&nbsp;&nbsp;Earth Sciences</option>
		<option value="Life Sciences">&nbsp;&nbsp;&nbsp;Life Sciences</option>
		<option value="Mathematics">&nbsp;&nbsp;&nbsp;Mathematics</option>
		<option value="Natural Sciences">&nbsp;&nbsp;&nbsp;Natural Sciences</option>
		<option value="Nature">&nbsp;&nbsp;&nbsp;Nature</option>
		<option value="Physics">&nbsp;&nbsp;&nbsp;Physics</option>
		<option value="Social Sciences">&nbsp;&nbsp;&nbsp;Social Sciences</option>
		<option value="Society &amp; Culture">Society &amp; Culture</option>
		<option value="Documentary">&nbsp;&nbsp;&nbsp;Documentary</option>
		<option value="Personal Journals">&nbsp;&nbsp;&nbsp;Personal Journals</option>
		<option value="Philosophy">&nbsp;&nbsp;&nbsp;Philosophy</option>
		<option value="Places &amp; Travel">&nbsp;&nbsp;&nbsp;Places &amp; Travel</option>
		<option value="Relationships">&nbsp;&nbsp;&nbsp;Relationships</option>
		<option value="Sports">Sports</option>
		<option value="Baseball">&nbsp;&nbsp;&nbsp;Baseball</option>
		<option value="Basketball">&nbsp;&nbsp;&nbsp;Basketball</option>
		<option value="Cricket">&nbsp;&nbsp;&nbsp;Cricket</option>
		<option value="Fantasy Sports">&nbsp;&nbsp;&nbsp;Fantasy Sports</option>
		<option value="Football">&nbsp;&nbsp;&nbsp;Football</option>
		<option value="Golf">&nbsp;&nbsp;&nbsp;Golf</option>
		<option value="Hockey">&nbsp;&nbsp;&nbsp;Hockey</option>
		<option value="Rugby">&nbsp;&nbsp;&nbsp;Rugby</option>
		<option value="Running">&nbsp;&nbsp;&nbsp;Running</option>
		<option value="Soccer">&nbsp;&nbsp;&nbsp;Soccer</option>
		<option value="Swimming">&nbsp;&nbsp;&nbsp;Swimming</option>
		<option value="Tennis">&nbsp;&nbsp;&nbsp;Tennis</option>
		<option value="Volleyball">&nbsp;&nbsp;&nbsp;Volleyball</option>
		<option value="Wilderness">&nbsp;&nbsp;&nbsp;Wilderness</option>
		<option value="Wrestling">&nbsp;&nbsp;&nbsp;Wrestling</option>
		<option value="Technology">Technology</option>
		<option value="True Crime">True Crime</option>
		<option value="TV &amp; Film">TV &amp; Film</option>
		<option value="After Shows">&nbsp;&nbsp;&nbsp;After Shows</option>
		<option value="Film History">&nbsp;&nbsp;&nbsp;Film History</option>
		<option value="Film Interviews">&nbsp;&nbsp;&nbsp;Film Interviews</option>
		<option value="Film Reviews">&nbsp;&nbsp;&nbsp;Film Reviews</option>
		<option value="TV Reviews">&nbsp;&nbsp;&nbsp;TV Reviews</option>
	</select>
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	select {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
