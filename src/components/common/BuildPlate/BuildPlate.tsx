import type { FunctionComponent } from 'react';
import styles from './BuildPlate.module.css';

const getCommitRef = (): string => {
  const commitRef = JSON.parse(__DEFINE_COMMIT_REF__) as string;

  if (!commitRef) {
    return 'develop';
  }

  return commitRef.slice(0, 7);
};

const getBuildTimestamp = (): string => {
  const buildTimestamp = JSON.parse(__DEFINE_BUILD_TIMESTAMP__);

  return new Date(buildTimestamp)
    .toJSON()
    .slice(0, 16)
    .replace('T', ' ');
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
