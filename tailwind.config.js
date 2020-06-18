//require('typeface-work-sans')
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [],
  theme: {
    extend: {
    	colors: {
    		japan: {
    			dark: '#203f54',
    			blue: '#508ebf',
    			lightblue: '#ccdbea',
    			white: '#f7f6f6',
    			pink: '#dc97a5'
    		},
    		bright: {
    			pink: '#f69f98',
    			peach: '#fdd5c8',
    			white: '#faf2e8',
    			blue: '#5ee1f1'
    		}
    	},
    	fontFamily: {
    		work: ['"Work Sans"', "sans-serif"],
    		aleo: ["Aleo", "serif"],
    		apple: ["Homemade Apple", "serif"]
    	},
    	spacing: {
    		'72': '18rem',
    		'84': '21rem',
    	}
    },
  },
  variants: {},
  plugins: [
  	plugin(function({ addVariant, e }) {
  		addVariant('after', ({ modifySelectors, separator }) => {
  			modifySelectors(({ className }) => {
  				return `.${e(`after${separator}${className}`)}:after`
  			})
  		})
  	})
  ],
}
