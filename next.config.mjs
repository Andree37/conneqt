import rehypeShiki from '@leafac/rehype-shiki'
import nextMDX from '@next/mdx'
import {Parser} from 'acorn'
import jsx from 'acorn-jsx'
import escapeStringRegexp from 'escape-string-regexp'
import * as path from 'path'
import {recmaImportImages} from 'recma-import-images'
import remarkGfm from 'remark-gfm'
import {remarkRehypeWrap} from 'remark-rehype-wrap'
import remarkUnwrapImages from 'remark-unwrap-images'
import shiki from 'shiki'
import {unifiedConditional} from 'unified-conditional'

/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async function headers() {
        return [
            {
                // matching all API routes
                source: "/.well-known/:path*",
                headers: [
                    {key: "Access-Control-Allow-Credentials", value: "true"},
                    {key: "Access-Control-Allow-Origin", value: "*"}, // replace this your actual origin
                    {key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT"},
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
                    },
                ]
            }
        ]
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}


function remarkMDXLayout(source, metaName) {
    let parser = Parser.extend(jsx())
    let parseOptions = {ecmaVersion: 'latest', sourceType: 'module'}

    return (tree) => {
        let imp = `import _Layout from '${source}'`
        let exp = `export default function Layout(props) {
      return <_Layout {...props} ${metaName}={${metaName}} />
    }`

        tree.children.push(
            {
                type: 'mdxjsEsm',
                value: imp,
                data: {estree: parser.parse(imp, parseOptions)},
            },
            {
                type: 'mdxjsEsm',
                value: exp,
                data: {estree: parser.parse(exp, parseOptions)},
            },
        )
    }
}

export default async function config() {
    let highlighter = await shiki.getHighlighter({
        theme: 'css-variables',
    })

    let withMDX = nextMDX({
        extension: /\.mdx$/,
        options: {
            recmaPlugins: [recmaImportImages],
            rehypePlugins: [
                [rehypeShiki, {highlighter}],
                [
                    remarkRehypeWrap,
                    {
                        node: {type: 'mdxJsxFlowElement', name: 'Typography'},
                        start: ':root > :not(mdxJsxFlowElement)',
                        end: ':root > mdxJsxFlowElement',
                    },
                ],
            ],
            remarkPlugins: [
                remarkGfm,
                remarkUnwrapImages,
                [
                    unifiedConditional,
                    [
                        new RegExp(`^${escapeStringRegexp(path.resolve('src/app/blog'))}`),
                        [[remarkMDXLayout, '@/app/blog/wrapper', 'article']],
                    ],
                    [
                        new RegExp(`^${escapeStringRegexp(path.resolve('src/app/work'))}`),
                        [[remarkMDXLayout, '@/app/work/wrapper', 'caseStudy']],
                    ],
                ],
            ],
        },
    })

    return withMDX(nextConfig)
}
