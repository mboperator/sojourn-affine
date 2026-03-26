import { Divider, Scrollable } from '@affine/component';
import { LinksRow } from '@affine/core/desktop/dialogs/doc-info/links-row';
import { DocDatabaseBacklinkInfo } from '@affine/core/modules/doc-info';
import { DocLinksService } from '@affine/core/modules/doc-link';
import { useI18n } from '@affine/i18n';
import { useLiveData, useServices } from '@toeverything/infra';
import { Suspense, useEffect } from 'react';

import * as styles from './doc-info.css';

export const BiDirectionalLinksSheet = ({ docId }: { docId: string }) => {
  const { docLinksService } = useServices({
    DocLinksService,
  });
  const t = useI18n();

  const links = useLiveData(docLinksService.links.links$);
  const backlinks = useLiveData(docLinksService.backlinks.backlinks$);

  useEffect(() => {
    docLinksService.backlinks.revalidateFromCloud();
  }, [docLinksService.backlinks]);

  return (
    <Scrollable.Root className={styles.scrollableRoot}>
      <Scrollable.Viewport data-testid="bi-directional-links-menu">
        <Suspense>
          <DocDatabaseBacklinkInfo />

          {backlinks && backlinks.length > 0 ? (
            <>
              <LinksRow
                className={styles.linksRow}
                references={backlinks}
                count={backlinks.length}
                label={t['com.affine.page-properties.backlinks']()}
              />
              <Divider size="thinner" />
            </>
          ) : null}
          {links && links.length > 0 ? (
            <>
              <LinksRow
                className={styles.linksRow}
                references={links}
                count={links.length}
                label={t['com.affine.page-properties.outgoing-links']()}
              />
              <Divider size="thinner" />
            </>
          ) : null}
        </Suspense>
      </Scrollable.Viewport>
      <Scrollable.Scrollbar className={styles.scrollBar} />
    </Scrollable.Root>
  );
};
