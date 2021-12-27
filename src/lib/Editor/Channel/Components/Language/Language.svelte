<script>
	import { rssData } from '$/editor';
</script>

<label>
	<h3>Language (required)</h3>
	<select bind:value={$rssData.language}>
		<option value="" disabled="">Choose one option...</option>
		<option value="af">Afrikaans</option>
		<option value="ak">Akan</option>
		<option value="sq">Albanian</option>
		<option value="ar">Arabic</option>
		<option value="hy">Armenian</option>
		<option value="az">Azerbaijani</option>
		<option value="bm">Bambara</option>
		<option value="eu">Basque</option>
		<option value="be">Belarusian</option>
		<option value="bn">Bengali</option>
		<option value="bs">Bosnian</option>
		<option value="br">Breton</option>
		<option value="bg">Bulgarian</option>
		<option value="my">Burmese</option>
		<option value="ca">Catalan</option>
		<option value="km">Central Khmer</option>
		<option value="ce">Chechen</option>
		<option value="zh-cn">Chinese (Simplified)</option>
		<option value="zh-tw">Chinese (Traditional)</option><option value="kw">Cornish</option>
		<option value="hr">Croatian</option>
		<option value="cs">Czech</option>
		<option value="da">Danish</option>
		<option value="nl">Dutch</option>
		<option value="nl-be">Dutch (Belgium)</option>
		<option value="nl-nl">Dutch (Netherlands)</option>
		<option value="dz">Dzongkha</option>
		<option value="en">English</option>
		<option value="en-au">English (Australia)</option>
		<option value="en-bz">English (Belize)</option>
		<option value="en-ca">English (Canada)</option>
		<option value="en-ie">English (Ireland)</option>
		<option value="en-jm">English (Jamaica)</option>
		<option value="en-nz">English (New Zealand)</option>
		<option value="en-ph">English (Phillipines)</option>
		<option value="en-za">English (South Africa)</option>
		<option value="en-tt">English (Trinidad)</option>
		<option value="en-gb">English (United Kingdom)</option>
		<option value="en-us">English (United States)</option>
		<option value="en-zw">English (Zimbabwe)</option>
		<option value="eo">Esperanto</option>
		<option value="et">Estonian</option>
		<option value="ee">Ewe</option>
		<option value="fo">Faeroese</option>
		<option value="fil">Filipino</option>
		<option value="fi">Finnish</option>
		<option value="fr">French</option>
		<option value="fr-be">French (Belgium)</option>
		<option value="fr-ca">French (Canada)</option><option value="fr-fr">French (France)</option>
		<option value="fr-lu">French (Luxembourg)</option>
		<option value="fr-mc">French (Monaco)</option>
		<option value="fr-ch">French (Switzerland)</option>
		<option value="ff">Fulah</option>
		<option value="gd">Gaelic</option>
		<option value="gl">Galician</option>
		<option value="lg">Ganda</option>
		<option value="ka">Georgian</option>
		<option value="de">German</option>
		<option value="de-at">German (Austria)</option>
		<option value="de-de">German (Germany)</option>
		<option value="de-li">German (Liechtenstein)</option>
		<option value="de-lu">German (Luxembourg)</option>
		<option value="de-ch">German (Switzerland)</option>
		<option value="el">Greek</option>
		<option value="gu">Gujarati</option>
		<option value="ha">Hausa</option>
		<option value="haw">Hawaiian</option>
		<option value="he">Hebrew</option>
		<option value="hi">Hindi</option>
		<option value="hu">Hungarian</option>
		<option value="is">Icelandic</option>
		<option value="ig">Igbo</option>
		<option value="in">Indonesian</option>
		<option value="iu">Inuktitut</option>
		<option value="ga">Irish</option>
		<option value="it">Italian</option>
		<option value="it-it">Italian (Italy)</option>
		<option value="it-ch">Italian (Switzerland)</option>
		<option value="ja">Japanese</option>
		<option value="kl">Kalaallisut</option>
		<option value="kn">Kannada</option>
		<option value="ks">Kashmiri</option>
		<option value="kk">Kazakh</option>
		<option value="ki">Kikuyu</option>
		<option value="rw">Kinyarwanda</option>
		<option value="ky">Kirghiz</option>
		<option value="ko">Korean</option>
		<option value="lo">Lao</option>
		<option value="lv">Latvian</option>
		<option value="ln">Lingala</option>
		<option value="lt">Lithuanian</option>
		<option value="lu">Luba-Katanga</option>
		<option value="lb">Luxembourgish</option>
		<option value="mk">Macedonian</option>
		<option value="mg">Malagasy</option>
		<option value="ms">Malay</option>
		<option value="ml">Malayalam</option>
		<option value="mt">Maltese</option>
		<option value="gv">Manx</option>
		<option value="mr">Marathi</option>
		<option value="mn">Mongolian</option>
		<option value="nd">Ndebele, North</option>
		<option value="nr">Ndebele, South</option>
		<option value="ne">Nepali</option>
		<option value="se">Northern Sami</option>
		<option value="no">Norwegian</option>
		<option value="nb">Norwegian Bokmål</option>
		<option value="nn">Norwegian Nynorsk</option>
		<option value="om">Oromo</option>
		<option value="os">Ossetian</option>
		<option value="pa">Panjabi</option>
		<option value="fa">Persian</option>
		<option value="pl">Polish</option>
		<option value="pt">Portuguese</option>
		<option value="pt-br">Portuguese (Brazil)</option>
		<option value="pt-pt">Portuguese (Portugal)</option><option value="qu">Quechua</option>
		<option value="ro">Romanian</option>
		<option value="ro-mo">Romanian (Moldova)</option>
		<option value="ro-ro">Romanian (Romania)</option>
		<option value="rm">Romansh</option>
		<option value="rn">Rundi</option>
		<option value="ru">Russian</option>
		<option value="ru-mo">Russian (Moldova)</option>
		<option value="ru-ru">Russian (Russia)</option><option value="sg">Sango</option>
		<option value="sr">Serbian</option>
		<option value="sn">Shona</option>
		<option value="ii">Sichuan Yi</option>
		<option value="si">Sinhala</option>
		<option value="sk">Slovak</option>
		<option value="sl">Slovenian</option>
		<option value="so">Somali</option>
		<option value="es">Spanish</option>
		<option value="es-ar">Spanish (Argentina)</option>
		<option value="es-bo">Spanish (Bolivia)</option>
		<option value="es-cl">Spanish (Chile)</option>
		<option value="es-co">Spanish (Colombia)</option>
		<option value="es-cr">Spanish (Costa Rica)</option>
		<option value="es-do">Spanish (Dominican Republic)</option>
		<option value="es-ec">Spanish (Ecuador)</option>
		<option value="es-sv">Spanish (El Salvador)</option>
		<option value="es-gt">Spanish (Guatemala)</option>
		<option value="es-hn">Spanish (Honduras)</option>
		<option value="es-mx">Spanish (Mexico)</option>
		<option value="es-ni">Spanish (Nicaragua)</option>
		<option value="es-pa">Spanish (Panama)</option>
		<option value="es-py">Spanish (Paraguay)</option>
		<option value="es-pe">Spanish (Peru)</option>
		<option value="es-pr">Spanish (Puerto Rico)</option>
		<option value="es-es">Spanish (Spain)</option>
		<option value="es-uy">Spanish (Uruguay)</option>
		<option value="es-ve">Spanish (Venezuela)</option>
		<option value="sw">Swahili</option>
		<option value="sv">Swedish</option>
		<option value="sv-fi">Swedish (Finland)</option>
		<option value="sv-se">Swedish (Sweden)</option>
		<option value="tl">Tagalog</option>
		<option value="tg">Tajik</option>
		<option value="ta">Tamil</option>
		<option value="tt">Tatar</option>
		<option value="te">Telugu</option>
		<option value="th">Thai</option>
		<option value="bo">Tibetan</option>
		<option value="ti">Tigrinya</option>
		<option value="to">Tonga (Tonga Islands)</option>
		<option value="tr">Turkish</option>
		<option value="tk">Turkmen</option>
		<option value="ug">Uighur</option>
		<option value="uk">Ukrainian</option>
		<option value="uk">Ukranian</option>
		<option value="ur">Urdu</option>
		<option value="uz">Uzbek</option>
		<option value="vi">Vietnamese</option>
		<option value="cy">Welsh</option>
		<option value="wo">Wolof</option>
		<option value="yi">Yiddish</option>
		<option value="yo">Yoruba</option>
		<option value="zu">Zulu</option>
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
