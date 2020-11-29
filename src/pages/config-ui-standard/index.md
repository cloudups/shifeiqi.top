---
title: 🧠 一种"No-Code"草案：根据配置生成UI界面
date: '2020-11-29'
spoiler: 🥕 generate ui by configs
cta: 'no-code'
---

## 1 动机

**问题** 

- 业务页面存在重复编码【复制-粘贴】的现象。
- 业务开发人员无法保证单个页面交付的可靠性。
- 业务开发人员需要花费大量时间去测试、维护系统。

**目标**

在保证可测试性、可维护性的基础上解决80%业务页面重复编码、重复测试的问题。

**方案**

通过提供一种框架，使得业务开发人员能够通过配置直接生成UI。

```

+---------+       +-----------+         +------+
|  config |  -->  | framework |   -->   | view |
+---------+       +-----------+         +------+

```

## 2 配置草案

### 2.1 约定

**变量名**

配置文件中的所有变量名都要以 `@` 开头，如：`@name` , `@city` 等等

---

### 2.1 配置总览

**字段定义**

用于定义一些字符串或者国际化，用于页面的业务信息展示。

```jsx
{
    "fileds": {
        "@title": "个人信息查询",
        "@save": "保存"
        //...
    }
    // ...
}
```

**远程接口定义**

远程接口用于数据的查询、保存等操作。

```jsx
{
    "api": {
        "@query": "/test/query"
    }
}
```

**视图定义**

用于定义页面的视图，直接映射到UI。

```jsx
{
    "view": [
        {
            "Component": "Button",
            "name": "@save",
            "props": {
                "click": [
                    '@action1',
                    //...
                ]
            }
        },
        {
            "Component": "Table",
            "name": "@table",
            "props": {
                //...
            }
        }
    ]
}
```

**动作**

用于响应组件的点击、输入、焦点变化等。

```jsx
{
    "actions": {
        "@save": {
            "type": "api"
        }
    }
}

```

## 请求



## 一个例子

```jsxon
{
    "fields": {
        "@tip": "请不要吐痰",
        "zh": {

        },
        "en": {

        }
    },
    
    "api": {
        "get": {
            "@query": "/test/query"
        },
        "post": {
            "@save": "/test/save"
        }
    },
    "view": [
        {
            "component": "Form",
            "name": "@form",
            "children": [
                //...
            ]
        },
        {
            "component": "Button",
            "props": {
                "click": { // event
                    "target": "@query",
                    "params": "@form.data"
                }
            },
            "childnre": {
                "component": "Modal",
                "props": {
                    "onOk": { // event
                        "target": "@save",
                        "params": "@table.data"
                    }
                },
                "children": "是否保存？" 
            }
        },
        {
            "component": "Table",
            "name": "@table",
            "props": {

            },
            "children": {

            }
        }
    ]
}
```