import {DocumentTextIcon, StarIcon, ClockIcon, WarningOutlineIcon, TagIcon, UserIcon, EnvelopeIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Posts')
            .items([
              S.listItem()
                .title('All posts')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('All posts')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Featured')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('Featured posts')
                    .filter('_type == "post" && featured == true')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Scheduled (future)')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Scheduled posts')
                    .filter('_type == "post" && defined(publishedAt) && publishedAt > now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Needs SEO attention')
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title('Missing description or excerpt')
                    .filter('_type == "post" && (!defined(metaDescription) && !defined(excerpt))')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                ),
            ]),
        ),
      S.documentTypeListItem('category').title('Categories').icon(TagIcon),
      S.documentTypeListItem('author').title('Authors').icon(UserIcon),
      S.divider(),
      S.documentTypeListItem('lead').title('Leads').icon(EnvelopeIcon),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['post', 'category', 'author', 'lead'].includes(item.getId()!),
      ),
    ])
