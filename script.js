let array = [793, 839, 892, 1036, 1065]; // Initial array values
let originalArray = [...array]; // To reset the array
let speed = 500; // Default speed (milliseconds)

function renderArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = ''; // Clear previous bars
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / 1100) * 100}%`; // Scaling the height based on value
        bar.textContent = value;
        container.appendChild(bar);
    });
}

function renderSortedValues() {
    const sortedContainer = document.getElementById('sortedValues');
    sortedContainer.innerHTML = ''; // Clear previous sorted values
    array.forEach(value => {
        const sortedValue = document.createElement('div');
        sortedValue.className = 'sorted-value';
        sortedValue.textContent = value;
        sortedContainer.appendChild(sortedValue);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
            renderArrayBars(arr, j, j + 1);
            await sleep(speed);
        }
    }
    array = arr;
    renderSortedValues();
}

async function selectionSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; // Swap
        renderArrayBars(arr, i, minIdx);
        await sleep(speed);
    }
    array = arr;
    renderSortedValues();
}

async function insertionSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
        renderArrayBars(arr, i, j + 1);
        await sleep(speed);
    }
    array = arr;
    renderSortedValues();
}

async function mergeSort() {
    let arr = [...array];
    await mergeSortHelper(arr);
    array = arr;
    renderSortedValues();
}

async function mergeSortHelper(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await mergeSortHelper(arr.slice(0, mid));
    const right = await mergeSortHelper(arr.slice(mid));
    return merge(left, right);
}

async function merge(left, right) {
    let result = [], leftIndex = 0, rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    result = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    renderArrayBars(result);
    await sleep(speed);
    return result;
}

async function quickSort() {
    let arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    array = arr;
    renderSortedValues();
}

async function quickSortHelper(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
        renderArrayBars(arr, j, high);
        await sleep(speed);
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap
    return i + 1;
}

async function heapSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
        await heapify(arr, i, 0);
    }
    array = arr;
    renderSortedValues();
}

async function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
        renderArrayBars(arr, i, largest);
        await sleep(speed);
        await heapify(arr, n, largest);
    }
}

function renderArrayBars(arr, ...highlightIndices) {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = ''; // Clear previous bars
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / 1100) * 100}%`;
        bar.textContent = value;
        if (highlightIndices.includes(index)) {
            bar.style.backgroundColor = '#FF5733'; // Highlighted color for selected elements
        }
        container.appendChild(bar);
    });
}

function randomizeArray() {
    array = Array.from({ length: document.getElementById('sizeRange').value }, () => Math.floor(Math.random() * 1000) + 100);
    renderArray();
}

function resetArray() {
    array = [...originalArray];
    renderArray();
}

document.getElementById('speedRange').addEventListener('input', function () {
    speed = this.value;
    document.getElementById('speedValue').textContent = `${this.value} ms`;
});

document.getElementById('sizeRange').addEventListener('input', function () {
    const size = this.value;
    document.getElementById('sizeValue').textContent = size;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 1000) + 100);
    renderArray();
});

renderArray();
