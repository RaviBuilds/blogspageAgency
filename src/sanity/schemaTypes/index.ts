import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {ctaBlockType} from './ctaBlockType'
import {postType} from './postType'
import {authorType} from './authorType'
import {leadType} from './leadType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ctaBlockType, blockContentType, categoryType, postType, authorType, leadType],
}
