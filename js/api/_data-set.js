const authors = ["Sam", "Derek", "Emanuel", "Robert", "Ivan", "Kris", "Hanz", "Krisk", "Linkoln", "Till", "Tom", "Taras", "Max", "Viktoria"]
const postStatus = ["draft", "published", "published", "published"];

const getRandom = (from, to) => Math.floor(Math.random() * to) + from;

const addCreatedAt = array => array.map(el => {
	el.created_at = new Date(getRandom(1800, 2021), getRandom(0, 12), getRandom(1, 30)).valueOf();
	return el;
})

const addID = (array, type) => array.map((el, i) => {
	const key = type.toLowerCase();
	el.id = `${key}_${i}`;
	return el;
})

const addAuthor = array => array.map(el => {
	el.author = authors[getRandom(0, authors.length - 1)];
	return el;
});

const addPostStatus = array => array.map(el => {
	el.status = postStatus[getRandom(0, postStatus.length - 1)];
	return el;
});

const flow = type => (funcs, data) => funcs.reduce((acc, func) => {
	acc = typeof func === 'function' ? func(data, type) : data;
	return acc;
}, data);

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

window.TEMP_POSTS = [
	/*Posts about animals*/
	{
		title: "Aardvark",
		content: `This medium-sized nocturnal mammal, native to Africa, only eats ants, termites and one type of cucumber, called Aardvark cucumber. 
			It is believed by African magicians to have magical powers.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/aardvark.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Baboon",
		content: `These monkeys are furry and noisy, but very caring for their young. 
			They are omnivore foragers, but are also known to eat sheep, goats and small antelopes. In Egyptian folklore, Baboons were considered sacred animals.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/baboon-and-baby.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Cheetah",
		content: `This large feline is the fastest animal on land running with a speed of up to 120 km/hour in short 500 meter bursts. 
			It can accelerate from 0 to 100 km/hour in 3 seconds. They have non-retractable claws so they can’t climb tall trees.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/cheetah.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Desert Warthog",
		content: `While some say this is not the prettiest pig relative out there, we just can’t ignore his resemblance to Pumba (the Lion King character). 
			We think it’s quite a character with its huge tusks and unwavering care for it’s young.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/desert-warthog.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Elephant",
		content: `With elephants being the largest creatures on land at the moment, it’s no wonder the elephant babies weight 100 kilograms at birth. 
			But did you know the gestation period lasts for 22 months?`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2017/11/shutterstock_341792189.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Fennec Fox",
		content: `With a total body length between 24 and 40 cm, this big eared guy is the smallest fox there is. 
			Their ears help them detect insects and rodents hiding underground.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/fennec-fox.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Giraffe",
		content: `With it long neck the giraffe can reach the tallest and tastiest leaves in the savanna and also engage in “neckings”, a type of male combat in which the neck is used as a weapon.
			 Vulnerable to predators as an adult, calf giraffes are hunted by lions, leopard and hyenas. Did you know there’s a special hotel in Kenya where you can feed giraffes from your hotel room window?!`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/giraffe.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Hippo",
		content: `Hippos are large, mostly herbivorous,  semi-aquatic mammals. Despite their pig-like appearance their closest relatives are whales, from which they diverged some 55 millions of years ago.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/Hippopotamus.jpg",
		categories: [1],
		tags: [4],
	},
	{
		title: "Lion",
		content: `The King of the Jungle, the second largest feline after the Tiger, the Lion is today considered a vulnerable species, with its population decline of thirty to fifty percent in the last 20 years.`,
		thumbnail: "https://www.edreams.com/blog/wp-content/uploads/sites/3/2012/02/lion.jpg",
		categories: [1],
		tags: [4],
	},

	/*Posts about trees*/
	{
		title: "Apple Tree (Malus Domestica)",
		content: `What better place to start this journey, than with the apple tree. The apple tree represents so many things, and these trees have become integral to farming practices all 
			over the planet. Apple trees are of the deciduous variety, and they prefer to grow in moist, rich, and well drained soils, which is very common for fruit trees.`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/apple-tree-11032021-728x486.jpg",
		categories: [2],
		tags: [3,4],
	},
	{
		title: "Pear Tree (Pyrus Communis)",
		content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aut dolor esse minus neque
			 perferendis praesentium qui quos velit voluptates? Ad dolorem et expedita, facilis ipsa iure nam rem sit?`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/pear-tree-11032021-728x486.jpg",
		categories: [2],
		tags: [3],
	},
	{
		title: "Peach Tree (Prunus Persica)",
		content: `When we think of pears, we immediately then think of peaches. Peaches are actually native to northwestern China, 
			and since then have been cultivated all over the world. Their scientific name, persica, comes from the very popular cultivation of the peach tree in Persia.`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/pear-tree-11032021-728x486.jpg",
		categories: [2],
		tags: [3,1],
	},
	{
		title: "Banyan Tree (Ficus Benghalensis)",
		content: `The banyan tree both a deciduous and evergreen tree. When fall comes, the leaves do not change color but merely fall off. 
			The banyan is part of the fig tree family, and it bears fruit in the form of a syconium (this is an enlarged, pitless fruit with multiple ovaries inside).`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/Banyan-tree.jpg",
		categories: [2],
		tags: [3],
	},
	{
		title: "Common Fig Tree (Ficus Carica)",
		content: `The common fig tree is a species of flowering plant that is native to the Mediterranean and western Asia. It is part of the mulberry family, and has been naturalized in North America as well. 
			They prefer to grow in deep and moist soil, though they have been known to grow in rocky dry locations as well.`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/common-fig-tree-10032021-728x483.jpg",
		categories: [2],
		tags: [3,4],
	},
	{
		title: "Black Ash Tree  (Fraxinus Nigra)",
		content: `The black ash tree is another deciduous variety that commonly occurs in swamps or other water-logged soils. 
			They are native all over eastern Canada and north eastern America, in provinces and states like Manitoba, Newfoundland, Virginia, and Illinois.`,
		thumbnail: "https://www.homestratosphere.com/wp-content/uploads/2019/07/black-ash-tree-dec11-870x580.jpg",
		categories: [2],
		tags: [3],
	},

	/*Posts about space*/
	{
		title: "Mercury",
		content: `Zipping around the sun in only 88 days, Mercury is the closest planet to the sun, and it's also the smallest, only a little bit larger than Earth's moon. 
			Because its so close to the sun (about two-fifths the distance between Earth and the sun), Mercury experiences dramatic changes in its day and night temperatures: 
			Day temperatures can reach a scorching 840  F (450 C), which is hot enough to melt lead. Meanwhile on the night side, temperatures drop to minus 290 F (minus 180 C). `,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/oU94fqcyf9HzQc59wJyaHN-970-80.jpg",
		categories: [3],
		tags: [1,3]
	},
	{
		title: "Venus",
		content: `The second planet from the sun, Venus is Earth's twin in size. Radar images beneath its atmosphere reveal that its surface has various mountains and volcanoes. 
			But beyond that, the two planets couldn't be more different. Because of its thick, toxic atmosphere that's made of sulfuric acid clouds, Venus is an extreme example of the greenhouse effect. 
			It's scorching-hot, even hotter than Mercury. The average temperature on Venus' surface is 900 F (465 C). At 92 bar, the pressure at the surface would crush and kill you. And oddly, Venus spins slowly from east to west, the opposite direction of most of the other planets.`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/KhHofvaDG73pypCEzyLuab-970-80.png",
		categories: [3],
		tags: [1]
	},
	{
		title: "Earth",
		content: `The third planet from the sun, Earth is a waterworld, with two-thirds of the planet covered by ocean. It's the only world known to harbor life. 
			Earth's atmosphere is rich in nitrogen and oxygen. Earth's surface rotates about its axis at 1,532 feet per second (467 meters per second) — slightly more than 1,000 mph (1,600 kph) — at the equator. 
			The planet zips around the sun at more than 18 miles per second (29 km per second).`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/4aeTmiqCqpRKuFc8tkDcmm-970-80.jpg",
		categories: [3],
		tags: [1,3]
	},
	{
		title: "Mars",
		content: `The fourth planet from the sun is Mars, and it's a cold, desert-like place covered in dust. This dust is made of iron oxides, giving the planet its iconic red hue. 
			Mars shares similarities with Earth: It is rocky, has mountains, valleys and canyons, and storm systems ranging from localized tornado-like dust devils to planet-engulfing dust storms.`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/tQUhJUq9GXqMfZXjGYdw8c-970-80.jpg",
		categories: [3],
		tags: [1]
	},
	{
		title: "Jupiter",
		content: `The fifth planet from the sun, Jupiter is a giant gas world that is the most massive planet in our solar system — more than twice as massive as all the other planets combined, according to NASA. 
			Its swirling clouds are colorful due to different types of trace gases. And a major feature in its swirling clouds is the Great Red Spot, a giant storm more than 10,000 miles wide. 
			It has raged at more than 400 mph for the last 150 years, at least. Jupiter has a strong magnetic field, and with 75 moons, it looks a bit like a miniature solar system.`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/YrXfB4LHEoo8HLzorBNpYV-970-80.jpg",
		categories: [3],
		tags: [1,3]
	},
	{
		title: "Saturn",
		content: `The sixth planet from the sun, Saturn is known most for its rings. 
			When polymath Galileo Galilei first studied Saturn in the early 1600s, he thought it was an object with three parts: a planet and two large moons on either side. 
			Not knowing he was seeing a planet with rings, the stumped astronomer entered a small drawing — a symbol with one large circle and two smaller ones — in his notebook, as a noun in a sentence describing his discovery.`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/Qx7SDx75F2BtYKhwAgokNE-970-80.jpg",
		categories: [3],
		tags: [1,4]
	},
	{
		title: "Uranus",
		content: `The seventh planet from the sun, Uranus is an oddball. It has clouds made of hydrogen sulfide, the same chemical that makes rotten eggs smell so foul. It rotates from east to west like Venus. `,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/yeYQhfCvNaqg7WxYoUSaN6-970-80.jpg",
		category_id: "2",
	},
	{
		title: "Neptune",
		content: `The eighth planet from the sun, Neptune is about the size of Uranus and is known for supersonic strong winds. 
			Neptune is far out and cold. The planet is more than 30 times as far from the sun as Earth. Neptune was the first planet predicted to exist by using math, before it was visually detected.`,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/eNTJrysq4A6DqXncBtsRrB-970-80.jpg",
		categories: [3],
		tags: [1]
	},
	{
		title: "Pluto (dwarf planet)",
		content: `Once the ninth planet from the sun, Pluto is unlike other planets in many respects. 
			It is smaller than Earth's moon; its orbit is highly elliptical, falling inside 
			Neptune's orbit at some points and far beyond it at others; and Pluto's orbit doesn't fall on the same plane as all the other planets —  instead, it orbits 17.1 degrees above or below. `,
		thumbnail: "https://cdn.mos.cms.futurecdn.net/kSKwk45EcMgpxf3UACgv9Z-970-80.jpg",
		categories: [3],
		tags: [1,3]
	},
];

window.TEMP_POST_SHUFLED = shuffle(TEMP_POSTS).map((el,i)=>{
	if(i%3 > 0) {
		el.user = 2; /*Max*/
	} else {
		el.user = 3; /*Viktoria*/
	}
	return el;
});

const defaultDataBaseStorage = {
	[window.TYPES.CATEGORY]: flow(window.TYPES.CATEGORY)([], [
		{
			title: "Category animals",
			category_id: "animals",
		},
		{
			title: "Category trees",
			category_id: "tree",
		},
		{
			title: "Category space",
			category_id: "space",
		},
	]),

	[window.TYPES.USER]: flow(window.TYPES.USER)([addID], authors.map(author => ({
		name: author,
	}))),

	[window.TYPES.TAG]: flow(window.TYPES.TAG)([addID], [
		{
			title: "Interesting",
			post_id: "post_0",
		},
		{
			title: "Boring",
			post_id: "post_1",
		},
		{
			title: "Crazy",
			post_id: "post_2",
		},
	]),

	[window.TYPES.COMMENT]: flow(window.TYPES.COMMENT)([addID], [
		{
			post_id: "post_0",
			author_id: "user_0",
			content: "Very interesting 111",
			status: "pending"
		},
		{
			post_id: "post_1",
			author_id: "user_1",
			content: "Very interesting 222",
			status: "approved"
		},
		{
			post_id: "post_2",
			author_id: "user_2",
			content: "Very interesting 333",
			status: "approved"
		},
	]),

}