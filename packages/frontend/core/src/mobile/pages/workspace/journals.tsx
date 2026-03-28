import { useThemeColorV2 } from '@affine/component';
import {
  getDateFromUrl,
  JournalPlaceholder,
} from '@affine/core/desktop/pages/workspace/journals';
import { JournalService } from '@affine/core/modules/journal';
import { ViewService, WorkbenchService } from '@affine/core/modules/workbench';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback, useLayoutEffect, useState } from 'react';

import { AppTabs } from '../../components';
import { AllDocsHeader } from '../../views';
import { JournalDatePicker } from './detail/journal-date-picker';
import * as styles from './journals.css';

const JournalContent = () => {
  const journalService = useService(JournalService);
  const workbench = useService(WorkbenchService).workbench;
  const view = useService(ViewService).view;
  const location = useLiveData(view.location$);
  const dateString = getDateFromUrl(location);
  const [ready, setReady] = useState(false);
  const allJournalDates = useLiveData(journalService.allJournalDates$);

  const handleDateChange = useCallback(
    (date: string) => {
      workbench.open(`/journals?date=${date}`, { at: 'active' });
    },
    [workbench]
  );

  useLayoutEffect(() => {
    // only handle current route
    if (!location.pathname.startsWith('/journals')) return;

    // check if the journal is created
    const docs = journalService.journalsByDate$(dateString).value;
    if (docs.length === 0) {
      setReady(true);
      return;
    }

    // if created, redirect to the journal
    const journal = docs[0];
    workbench.openDoc(journal.id, { replaceHistory: true, at: 'active' });
  }, [dateString, journalService, location.pathname, view, workbench]);

  if (!ready) return null;

  return (
    <>
      <JournalDatePicker
        date={dateString}
        onChange={handleDateChange}
        withDotDates={allJournalDates}
        className={styles.journalDatePicker}
      />
      <JournalPlaceholder dateString={dateString} />
    </>
  );
};

export const Component = () => {
  useThemeColorV2('layer/background/mobile/primary');
  return (
    <>
      <AllDocsHeader />
      <AppTabs />
      <JournalContent />
    </>
  );
};
