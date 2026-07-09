let highchartsPromise: Promise<typeof import('highcharts')> | null = null;

export async function loadHighcharts() {
  if (!highchartsPromise) {
    highchartsPromise = import('highcharts').then((module) => {
      const highcharts = (module as { default?: typeof import('highcharts') }).default;
      return (highcharts ?? module) as typeof import('highcharts');
    });
  }

  return highchartsPromise;
}
