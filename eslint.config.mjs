import vuetify from 'eslint-config-vuetify'
import vue from 'eslint-plugin-vue';

export default vuetify({
	plugins: { vue },
	rules: {
		'@stylistic/indent': [
			'error',
			'tab',
		],
		'@stylistic/no-tabs': ["error", { allowIndentationTabs: true }],
		'@stylistic/quote-props': [
			'error',
			'as-needed',
		],
		'@stylistic/quotes': [
			'error',
			'single',
			{ allowTemplateLiterals: 'always' },
		],
		'@typescript-eslint/consistent-type-definitions': [
			'error',
			'type'
		],
		'no-console': 'error',
		'vue/script-indent': ['error', 'tab', {
			baseIndent: 0,
			switchCase: 0,
			ignores: [],
		}],
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/html-quotes': [
			'error',
			'single'
		],
		'vue/script-indent': ['off']
	},
})