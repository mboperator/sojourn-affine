import { useSystemOnline } from '@affine/core/components/hooks/use-system-online';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { LiveData, useLiveData, useService } from '@toeverything/infra';
import { useMemo } from 'react';

import * as styles from './styles.css';

export const BlobSyncIndicator = () => {
  const isOnline = useSystemOnline();
  const workspace = useService(WorkspaceService).workspace;

  const blobState$ = useMemo(
    () => LiveData.from(workspace.engine.blob.state$, null),
    [workspace]
  );
  const blobState = useLiveData(blobState$);

  if (!blobState) return null;

  const { uploading, error } = blobState;

  // Online and everything synced - show nothing
  if (isOnline && uploading === 0 && error === 0) return null;

  let message: string;
  let variant: 'offline' | 'syncing' | 'error';

  if (!isOnline) {
    variant = 'offline';
    message =
      uploading > 0
        ? `Offline · ${uploading} item${uploading > 1 ? 's' : ''} saved locally`
        : 'Offline · changes saved locally';
  } else if (error > 0) {
    variant = 'error';
    message = `${error} item${error > 1 ? 's' : ''} failed to sync`;
  } else {
    variant = 'syncing';
    message = `Syncing ${uploading} item${uploading > 1 ? 's' : ''}…`;
  }

  return (
    <div className={styles.indicator} data-variant={variant}>
      <span className={styles.message}>{message}</span>
    </div>
  );
};
