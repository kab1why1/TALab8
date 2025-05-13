import time
import random
import math
import matplotlib.pyplot as plt
import numpy as np

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        if self.root is None:
            self.root = Node(value)
        else:
            self._insert(self.root, value)
    
    def _insert(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = Node(value)
            else:
                self._insert(node.left, value)
        else:
            if node.right is None:
                node.right = Node(value)
            else:
                self._insert(node.right, value)

def measure_insert_time(n_elements, n_trials=500, data_samples=5):
    times = []
    
    for _ in range(data_samples):
        elements = random.sample(range(n_elements * 10), n_elements)
        test_element = n_elements * 10 + 1
        
        total_time = 0
        for _ in range(n_trials):
            bst = BST()
            for elem in elements:
                bst.insert(elem)
            
            start_time = time.perf_counter_ns()
            bst.insert(test_element)
            end_time = time.perf_counter_ns()
            total_time += (end_time - start_time)
        
        times.append(total_time / n_trials)
    
    return np.mean(times), np.std(times)

# Параметри
sizes = np.arange(1000, 10001, 200)
experimental_means = []
experimental_stds = []
log_values = []

# Збір даних
for n in sizes:
    mean_time, std = measure_insert_time(n)
    experimental_means.append(mean_time)
    experimental_stds.append(std)
    log_values.append(math.log2(n))
    print(f"Size: {n}, Time: {mean_time:.2f} ± {std:.2f} ns")

# Обробка даних для гладкого графіка
window_size = 5
smooth_means = np.convolve(experimental_means, np.ones(window_size)/window_size, mode='valid')
smooth_sizes = sizes[len(sizes)-len(smooth_means):]

# Нормалізація
max_time = max(smooth_means)
max_log = max(log_values)
scale_factor = max_time / max_log
normalized_log = [log * scale_factor for log in log_values]

# Візуалізація
plt.figure(figsize=(12, 7))
plt.errorbar(sizes, experimental_means, yerr=experimental_stds, 
            fmt='o', alpha=0.3, label='Експериментальні дані')
plt.plot(smooth_sizes, smooth_means, label='Експериментальний', 
        color='orange', linewidth=2)
plt.plot(sizes, normalized_log, label='Теоретичний O(log n)', 
        linestyle='--', color='green')
plt.xlabel('Кількість елементів')
plt.ylabel('Час (наносекунди)')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()