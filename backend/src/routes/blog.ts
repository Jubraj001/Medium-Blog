import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from '@jubraj001/medium-blog-project-validations';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>()

blogRouter.use('/*', async (c, next) => {
  const token = c.req.header('authorization') || "";
  try {
    const user = await verify(token, c.env.JWT_SECRET);

    if (user.id) {
      c.set('userId', user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ error: 'unauthorized' });
    }
  } catch (error) {
    c.status(403);
    return c.json({ error: 'unauthorized' });
  }
})

blogRouter.post('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: 'Inputs are not correct'
    })
  }
  const authorId = c.get('userId');

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId
    }
  });

  return c.json({
    id: blog.id
  });
});

blogRouter.put('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: 'Inputs are not correct'
    })
  }

  const blog = await prisma.post.update({
    where: {
      id: body.id
    },
    data: {
      title: body.title,
      content: body.content
    }
  });

  return c.json({
    id: blog.id
  });
});

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs =  await prisma.post.findMany();

  return c.json({
    blogs
  })
});

blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = await c.req.param('id');

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id
      }
    });

    return c.json({
      blog
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: 'Error while fetching blog post'
    })
  }
});
