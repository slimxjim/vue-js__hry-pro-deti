import { ref } from 'vue';

export class StopWatcher {
  public time = ref<string>('NaN');
  public isRunning = ref<boolean>(false);
  public startTime = ref<number | null>(null);
  public timeMs = ref<number>(0);
  private times = ref<number[]>([0, 0, 0, 0]);
  private frameId = ref<number | null>(null);

  public start = () => {
    if (this.isRunning.value) console.log('Stopwatch has already started.');
    this.isRunning.value = true;
    if (!this.startTime.value) this.startTime.value = performance.now();
    this.frameId.value = requestAnimationFrame(this.step);
  };

  public stop = () => {
    if (!this.isRunning.value) console.log('Stopwatch has not been started yet.');//throw new Error('Stopwatch has not been started yet.');
    this.isRunning.value = false;
    this.startTime.value = null;
    this.timeMs.value = this.getTimeMs;
    this.times.value = [0, 0, 0, 0];
    if (this.frameId.value !== null) {
      cancelAnimationFrame(this.frameId.value);
      this.frameId.value = null;
    }
  };

  public reset = () => {
    this.startTime.value = null;
    this.isRunning.value = false;
    this.times.value = [0, 0, 0, 0];
    this.time.value = this.formatTimes();
    this.timeMs.value = 0;
  };

  public formatTimes(timesArray = this.times.value): string {
    const hours = this.pad0(timesArray[0], 2);
    const minutes = this.pad0(timesArray[1], 2);
    const seconds = this.pad0(timesArray[2], 2);
    const milliseconds = Math.floor(timesArray[3] * 10);//this.pad0(Math.trunc(timesArray[3] % 1000), 3);

    return `${minutes}:${seconds}.${milliseconds}`;
  }

  private get getTimeMs(): number {
    return Math.floor(
      this.times.value[0] * 60 * 60 * 1000 + // hours to milliseconds
      this.times.value[1] * 60 * 1000 +      // minutes to milliseconds
      this.times.value[2] * 1000 +           // seconds to milliseconds
      this.times.value[3] * 10               // tenths of a second to milliseconds
    );
  }

  private pad0 = (value: number, count: number) => {
    let result = value.toString();
    while (result.length < count) {
      result = '0' + result;
      --count;
    }
    return result;
  };

  private step = (timestamp: number) => {
    if (!this.isRunning.value) return;
    this.calculate(timestamp);
    this.startTime.value = timestamp;
    this.time.value = this.formatTimes();
    this.timeMs.value = this.getTimeMs;
    this.frameId.value = requestAnimationFrame(this.step);
  };

  private calculate = (timestamp: number) => {
    const diff = timestamp - (this.startTime.value ?? 0);
    this.times.value[3] += diff / 10;
    if (this.times.value[3] >= 100) {
      this.times.value[3] -= 100;
      this.times.value[2] += 1;
    }
    if (this.times.value[2] >= 60) {
      this.times.value[2] -= 60;
      this.times.value[1] += 1;
    }
    if (this.times.value[1] >= 60) {
      this.times.value[1] -= 60;
      this.times.value[0] += 1;
    }
  };
}
