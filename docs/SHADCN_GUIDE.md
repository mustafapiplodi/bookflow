# shadcn/ui Component Guide

## Usage Policy
- ✅ **ALWAYS use shadcn/ui components** for all UI elements
- ✅ Install components as needed: `npx shadcn@latest add [component-name]`
- ✅ Customize components in `src/components/ui/` directory
- ❌ **DO NOT** create custom buttons, inputs, dialogs from scratch
- ❌ **DO NOT** use other UI libraries (Material-UI, Ant Design, etc.)

## Installed Components
- ✅ Button, Card, Badge, Separator
- ✅ Input, Label, Form
- ✅ Dialog, Select, Textarea
- ✅ Tabs, DropdownMenu
- ✅ Toast (Sonner)

## Installation Examples

### Phase 1 - Authentication
```bash
npx shadcn@latest add button input label form card toast
```

### Phase 1 - Book Management
```bash
npx shadcn@latest add dialog select textarea badge tabs dropdown-menu
```

### Phase 1 - Notes & Sessions
```bash
npx shadcn@latest add popover command separator tooltip calendar
```

## Usage Examples

### Basic Button
```typescript
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">Primary Action</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Form with Validation
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email(),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Toast Notifications
```typescript
import { toast } from 'sonner'

toast.success('Book added successfully!')
toast.error('Failed to add book')
```

For full documentation, see: https://ui.shadcn.com
