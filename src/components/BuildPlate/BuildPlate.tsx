import type { FunctionComponent } from 'react';
import { formatToIsoDateTime } from '../../lib/format';
import styles from './BuildPlate.module.css';

const getCommitRef = (): string => {
  const commitRef = __DEFINE_COMMIT_REF__;

  if (!commitRef) {
    return 'develop';
  }

  return commitRef.slice(0, 7);
};

const getBuildTimestamp = (): string => {
  const buildTimestamp = __DEFINE_BUILD_TIMESTAMP__ || Date.now();

  return formatToIsoDateTime(buildTimestamp);
};

export const BuildPlate: FunctionComponent = () => {
  const commitRef = getCommitRef();
  const buildTimestamp = getBuildTimestamp();

  return (
    <span className={styles.BuildPlate}>
      <a href="https://github.com/icmx/floats">{commitRef}</a> · built
      at <time>{buildTimestamp}</time>
    </span>
  );
};
