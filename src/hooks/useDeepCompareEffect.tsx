import React, { EffectCallback, Ref, useEffect, useRef, } from 'react';
import isEqual from 'lodash/isEqual';

function useDeepCompareEffect(callback: EffectCallback, dependencies: any[]) {
  const currentDependenciesRef: any = useRef(dependencies);

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}

export default useDeepCompareEffect;