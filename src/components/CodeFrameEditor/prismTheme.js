
let prismTheme = {
    'pre[class*="language-"]': {
        color: '#839496',
        textShadow: '0 1px rgba(0, 0, 0, 0.3)',
        fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        lineHeight: 1.5,
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none',
        overflow: 'auto',
        borderRadius: '0.3em',
        background: 'var(--theme-bg)',
        margin: 0,
        padding: 0,
        paddingLeft: 4,
    },
    'code[class*="language-"]': {
        color: '#839496',
        textShadow: '0 1px rgba(0, 0, 0, 0.3)',
        fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        lineHeight: 1.5,
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none'
    },
    ':not(pre) > code[class*="language-"]': {
        background: '#002b36',
        padding: '.1em',
        borderRadius: '.3em'
    },
    'comment': {
        color: '#586e75'
    },
    'prolog': {
        color: '#586e75'
    },
    'doctype': {
        color: '#586e75'
    },
    'cdata': {
        color: '#586e75'
    },
    'punctuation': {
        color: '#93a1a1'
    },
    '.namespace': {
        Opacity: 0.7
    },
    'property': {
        color: '#268bd2'
    },
    'keyword': {
        color: '#859900'
    },
    'tag': {
        color: '#268bd2'
    },
    'class-name': {
        color: '#d4d48b',
    },
    'boolean': {
        color: '#b58900'
    },
    'constant': {
        color: '#b58900'
    },
    'symbol': {
        color: '#dc322f'
    },
    'deleted': {
        color: '#dc322f'
    },
    'number': {
        color: '#00baff'
    },
    'selector': {
        color: '#859900'
    },
    'attr-name': {
        color: '#859900'
    },
    'string': {
        color: '#859900'
    },
    'char': {
        color: '#859900'
    },
    'builtin': {
        color: '#859900'
    },
    'inserted': {
        color: '#859900'
    },
    'variable': {
        color: '#268bd2'
    },
    'parameter': {
        color: '#839496'
    },
    'operator': {
        color: '#EDEDED'
    },
    'function': {
        color: '#839496'
    },
    'regex': {
        color: '#E9C062'
    },
    'important': {
        color: '#fd971f',
        fontWeight: 'bold'
    },
    'entity': {
        color: '#FFFFB6',
        cursor: 'help'
    },
    'url': {
        color: '#96CBFE'
    },
    '.language-css .token.string': {
        color: '#87C38A'
    },
    '.style .token.string': {
        color: '#87C38A'
    },
    'bold': {
        fontWeight: 'bold'
    },
    'italic': {
        fontStyle: 'italic'
    },
    'atrule': {
        color: '#F9EE98'
    },
    'attr-value': {
        color: '#F9EE98'
    }
};

export default prismTheme;