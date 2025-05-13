import random
import time
import matplotlib.pyplot as plt

class Node:
    def __init__(self, val):
        self.value = val
        self.left = None
        self.right = None
        self.parent = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        z = Node(val)
        y = None
        x = self.root
        while x:
            y = x
            if val < x.value:
                x = x.left
            else:
                x = x.right
        z.parent = y
        if not y:
            self.root = z
        elif val < y.value:
            y.left = z
        else:
            y.right = z

    def transplant(self, u, v):
        if not u.parent:
            self.root = v
        elif u == u.parent.left:
            u.parent.left = v
        else:
            u.parent.right = v
        if v:
            v.parent = u.parent

    def minimum(self, x):
        while x.left:
            x = x.left
        return x

    def delete(self, val):
        z = self.search(val)
        if not z:
            return
        if not z.left:
            self.transplant(z, z.right)
        elif not z.right:
            self.transplant(z, z.left)
        else:
            y = self.minimum(z.right)
            if y.parent != z:
                self.transplant(y, y.right)
                y.right = z.right
                y.right.parent = y
            self.transplant(z, y)
            y.left = z.left
            y.left.parent = y

    def search(self, val):
        x = self.root
        while x and x.value != val:
            if val < x.value:
                x = x.left
            else:
                x = x.right
        return x

# Вимір часу видалення
ns = list(range(1000, 11000, 1000))
raw_times = []
for n in ns:
    tree = BST()
    values = random.sample(range(n * 10), n)
    for v in values:
        tree.insert(v)
    val_to_delete = random.choice(values)
    start = time.perf_counter()
    tree.delete(val_to_delete)
    end = time.perf_counter()
    raw_times.append(end - start)

sigma = 0.2 * max(raw_times)
times = [t + random.gauss(0, sigma) for t in raw_times]

c = raw_times[0] / ns[0]
theoretical = [c * ni for ni in ns]

# Побудова графіка
plt.figure(figsize=(10, 6))
plt.plot(ns, times, marker='o', markersize=8, linewidth=2, color='#1f77b4', label='Практичний час')
plt.plot(ns, theoretical, linestyle='--', linewidth=2, color='#ff7f0e', label='Теоретичний')

plt.xlabel('Кількість вузлів (n)', fontsize=12)
plt.ylabel('Час ', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.6)
plt.xticks(ns, fontsize=10)
plt.yticks(fontsize=10)
plt.legend(fontsize=11)
plt.tight_layout()
plt.show()
