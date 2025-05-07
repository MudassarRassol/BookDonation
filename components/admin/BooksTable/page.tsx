"use client"
import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Image, message, Popconfirm, Descriptions, Divider, Card, Avatar, Space, Input, Grid } from 'antd'
import { DeleteOutlined, EyeOutlined, UserOutlined, BookOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'

const { useBreakpoint } = Grid

interface Book {
  _id: string
  title: string
  author: string
  bookimg: string
  condition: string
  status: string
  description: string
  Category: string
  userId: {
    _id: string
    userdetailsId: {
      _id: string
      username: string
      city: string
      profilephoto: string
      role: string
    }
  }
  createdAt: string
  updatedAt: string
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const screens = useBreakpoint()

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchText.toLowerCase()) ||
                         book.userId?.userdetailsId?.city.toLowerCase().includes(searchText.toLowerCase())
      return matchesSearch
    })
    setFilteredBooks(filtered)
  }, [searchText, books])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/books/getallbooks')
      if (response.data.success) {
        setBooks(response.data.books)
        setFilteredBooks(response.data.books)
      }
    } catch (error) {
      message.error('Failed to fetch books')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookId: string) => {
    try {
      const response = await axios.delete(`/api/admin/books/deletebook?id=${bookId}`)
      if (response.data.success) {
        message.success('Book deleted successfully')
        fetchBooks()
      }
    } catch (error) {
      message.error('Failed to delete book')
      console.error(error)
    }
  }

  const showBookDetails = (book: Book) => {
    setSelectedBook(book)
    setIsModalVisible(true)
  }

  const getColumns = () => {
    const mobileColumns = [
      {
        title: 'Book',
        render: (record: Book) => (
          <Space direction="vertical" size={4}>
            <div className='flex items-center gap-[8px]'>
              <Image 
                src={record.bookimg} 
                alt="Book Cover" 
                width={40}
                className='  object-cover  rounded-md '
                preview={false}
              />
              <div>
              <div className="font-bold">{record.title}</div>
<div className="text-xs text-gray-600">{record.author}</div>

              </div>
            </div>
            <Space size={8}>
              <Tag 
                color={record.status === 'Available' ? 'green' : 'volcano'}
                style={{ margin: 0 }}
              >
                {record.status}
              </Tag>
              <Avatar 
                src={record.userId?.userdetailsId?.profilephoto} 
                size={20}
                icon={<UserOutlined />}
              />
            </Space>
          </Space>
        )
      },
      {
        title: 'Actions',
        render: (record: Book) => (
          <Space size={4}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => showBookDetails(record)}
              size="small"
            />
            <Popconfirm
              title="Delete this book?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                type="text"
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
        width: 80
      }
    ]

    const desktopColumns = [
      { 
        title: 'Cover', 
        dataIndex: 'bookimg', 
        render: (img: string) => (
          <Image 
            src={img} 
            alt="Book Cover" 
            width={50}
            height={70}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
        ),
        width: 80
      },
      { 
        title: 'Title', 
        dataIndex: 'title',
        render: (text: string) => <strong>{text}</strong>,
        sorter: (a: Book, b: Book) => a.title.localeCompare(b.title)
      },
      { 
        title: 'Author', 
        dataIndex: 'author',
        sorter: (a: Book, b: Book) => a.author.localeCompare(b.author)
      },
      { 
        title: 'Status', 
        render: (_: unknown, record: Book) => (
          <Tag 
            color={record.status === 'Available' ? 'green' : 'volcano'}
            icon={record.status === 'Available' ? <BookOutlined /> : null}
          >
            {record.status}
          </Tag>
        ),
        width: 120
      },
      { 
        title: 'Owner', 
        render: (_: unknown, record: Book) => (
            // <Link href={`/pages/donor-profile/${record.userId}`} className=' cursor-pointer ' >

            // </Link>
            <Space  >
            <Avatar 
              src={record.userId?.userdetailsId?.profilephoto} 
              icon={<UserOutlined />}
              size="small"
            />
            <span>{record.userId?.userdetailsId?.username}</span>
          </Space>
        )
      },
      { 
        title: 'City', 
        render: (_: unknown, record: Book) => (
          <Space>
            <EnvironmentOutlined style={{ color: '#1890ff' }} />
            <span>{record.userId?.userdetailsId?.city}</span>
          </Space>
        )
      },
      { 
        title: 'Added', 
        render: (_: unknown, record: Book) => (
          <span>{dayjs(record.createdAt).format('MMM D')}</span>
        ),
        width: 100
      },
      { 
        title: 'Actions', 
        render: (_: unknown, record: Book) => (
          <Space size="small">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => showBookDetails(record)}
              size="small"
            />
            <Popconfirm
              title="Delete this book?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
        width: 120
      }
    ]

    return screens.md ? desktopColumns : mobileColumns
  }

  return (
    <>
      <Card
        title="Books Management"
        extra={
          <Space>
            <Input
              placeholder={screens.md ? "Search by title, author or city" : "Search..."}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: screens.md ? 300 : 150 }}
              allowClear
            />
            {screens.md && (
              <Button 
                onClick={fetchBooks}
                loading={loading}
              >
                Refresh
              </Button>
            )}
          </Space>
        }
      >
        <Table
          columns={getColumns()}
          dataSource={filteredBooks}
          rowKey="_id"
          loading={loading}
          pagination={false}
          scroll={{ x: screens.md || undefined }}
          size="middle"
          className="responsive-table"
        />
      </Card>

      <Modal
        title={
          <Space>
            <BookOutlined />
            <span>Book Details</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={screens.md ? 900 : '100%'}
  
      >
        {selectedBook && (
          <div className="flex flex-col md:flex-row">
            <div  className="flex-1 border-b border-gray-200 md:border-b-0 md:border-r">
              <Image
                src={selectedBook.bookimg}
                alt={selectedBook.title}
                width="100%"
                style={{ 
                  maxHeight: '380px', 
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <div className='flex-[2] p-6 overflow-auto md:max-h-[70vh]'>
            <h1 className="mb-2 text-[20px] md:text-[24px]">{selectedBook.title}</h1>
<h3 className="text-gray-600 mb-6 text-[16px] md:text-[18px]">{selectedBook.author}</h3>

              
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Status">
                  <Tag color={selectedBook.status === 'Available' ? 'green' : 'volcano'}>
                    {selectedBook.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Category">{selectedBook.Category}</Descriptions.Item>
                <Descriptions.Item label="Condition">{selectedBook.condition}</Descriptions.Item>
                <Descriptions.Item label="Added On">
                  {dayjs(selectedBook.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {dayjs(selectedBook.updatedAt).format('MMMM D, YYYY [at] h:mm A')}
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left" plain>Description</Divider>
              <p className="whitespace-pre-line">{selectedBook.description}</p>

              <Divider orientation="left" plain>Owner Information</Divider>
              
              <Card className='p-[16px]'>
                <Space size="large">
                  <Avatar 
                    src={selectedBook.userId?.userdetailsId?.profilephoto} 
                    size={screens.md ? 64 : 48}
                    icon={<UserOutlined />}
                  />
                  <div>
                  <h3 className="mb-1">{selectedBook.userId?.userdetailsId?.username}</h3>

                    <Space size="middle">
                      <Tag color="blue">{selectedBook.userId?.userdetailsId?.role}</Tag>
                      <Space>
                        <EnvironmentOutlined style={{ color: '#1890ff' }} />
                        <span>{selectedBook.userId?.userdetailsId?.city}</span>
                      </Space>
                    </Space>
                  </div>
                </Space>
              </Card>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .responsive-table .ant-table-tbody > tr > td {
          padding: ${screens.md ? '12px 8px' : '8px 4px'} !important;
        }
        .responsive-table .ant-table-thead > tr > th {
          padding: ${screens.md ? '12px 8px' : '8px 4px'} !important;
        }
      `}</style>
    </>
  )
}

export default Books