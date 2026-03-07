# Checkpoint 3 Solution: Tailwind CSS

## Adding Tailwind CSS

### Method 1: CDN (Easiest)

Add to your HTML `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Using Utility Classes

```html
<!-- Background colors -->
<div class="bg-blue-500">Blue background</div>

<!-- Text colors and sizes -->
<h1 class="text-4xl font-bold text-gray-800">Large bold heading</h1>

<!-- Padding and margins -->
<div class="p-6 m-4">Padded and margined</div>

<!-- Flexbox -->
<div class="flex justify-center items-center">
    <p>Centered content</p>
</div>

<!-- Hover effects -->
<button class="bg-blue-600 hover:bg-blue-700 transition-colors">
    Hover me
</button>

<!-- Responsive design -->
<div class="w-full md:w-1/2 lg:w-1/3">
    Responsive width
</div>
```

## Common Tailwind Patterns

### Button
```html
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click Me
</button>
```

### Card
```html
<div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-4">Card Title</h2>
    <p class="text-gray-700">Card content goes here.</p>
</div>
```

### Container
```html
<div class="container mx-auto px-4 py-8">
    <!-- Your content -->
</div>
```

## Validation

Your template needs:
- ✅ Tailwind CDN link
- ✅ At least 4-5 utility classes
- ✅ Hover effect on at least one element

Run:
```bash
../workshop_check.sh 3
```

## Resources

- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind Docs](https://tailwindcss.com/docs)

## What's Next?

Checkpoint 4: Integrate AI capabilities!
