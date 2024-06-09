// const sidebar = `
//   <div>
//     Something else
//   </div>
//`

// {% for year in collections._postsByYear %}

// - <a href="/{{ year.key }}">{{ year.key }}</a>

// {% endfor %}


//export default sidebar;

// exports.data = function () {
// 	return {
// 		eleventyImport: {
// 			collections: ["post"],
// 		},
// 	};
// };

export default class Test {
	// or `async data() {`
	// or `get data() {`
	data() {
		return {
			name: "Ted",
			layout: "teds-rad-layout",
			// … other front matter keys
		};
	}

	render({ name }) {
		// will always be "Ted"
		return `<p>${name}</p>`;
	}
}

module.exports = Test;
// exports.render = function (data) {
// 	return `<ul>
//     ${data.collections.post
// 			.map((post) => `<li>${post.data.title}</li>`)
// 			.join("\n")}
//   </ul>`;
// };