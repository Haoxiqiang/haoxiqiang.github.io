---
layout: post
title:  Limits In SQLite
date:   2015-02-28 22:48:55
author: 郝锡强
categories: blog
letex: true
tags: [android]
---
最近检查`BUG`,发下一个奇怪的问题,[android.database.sqlite.SQLiteFullException database ](https://www.google.com/search?q=android.database.sqlite.SQLiteFullException+database+or+disk+is+full+(code+13)&oq=android.database.sqlite.SQLiteFullException+database+or+disk+is+full+(code+13)&aqs=chrome..69i57j69i60.479j0j4&sourceid=chrome&es_sm=119&ie=UTF-8),查阅很多资料也没有弄明白所以然,把一些整理的资料放上来,希望遇到的朋友指教.
![limitsinsqlite01](/source/images/blog/limitsinsqlite01.png)
<!-- more -->
最开始的时候我觉得是空间满了,但是根据上图的信息应该不是,然后就觉得是`SQLite`存在大小限制,于是我遇到了这样的说明[maximum-number-of-rows-in-a-sqlite-table](http://stackoverflow.com/questions/1546947/maximum-number-of-rows-in-a-sqlite-table)

>In July 2011 the sqlite3 limits page was updated to define the practical limits to this question based on the maximum size of the database which is 14 terabytes:
Maximum Number Of Rows In A Table
The theoretical maximum number of rows in a table is 264 (18446744073709551616 or about 1.8e+19). This limit is unreachable since the maximum database size of 14 terabytes will be reached first. A 14 terabytes database can hold no more than approximately 1e+13 rows, and then only if there are no indices and if each row contains very little data.So with a max database size of 14 terabytes you'd be lucky to get ~1 Trillion rows since if you actually had a useful table with data in it the number of rows would be constrained by the size of the data. You could probably have up to 10s of billions of rows in a 14 TB database.

论行数,论体积我这个都排不上啊!!!然后我就想到是不是平台的关系,我又找到了[Comparison_of_relational_database_management_systems](http://en.wikipedia.org/wiki/Comparison_of_relational_database_management_systems#Limits),也不是啊,这可如何是好,我有开始逐一的排查官方文档[Limits In SQLite](http://www.sqlite.org/limits.html)

* Maximum length of a string or BLOB 支持`string`或`BLOB`的长度是$$2^{31}-1 或者 2147483647 $$
* Maximum Number Of Columns 默认最多的列数是2000,可以在编译的时候设置为32767
* Maximum Length Of An SQL Statement 默认的限制是1000000,可以重新定义到1073741824
* Maximum Number Of Tables In A Join 最多只支持64个以内的链表查询
* Maximum Depth Of An Expression Tree 建议不要有深度过大,现在默认是1000,如果设置成0,是不强制限制
* Maximum Number Of Arguments On A Function 默认100
* Maximum Number Of Terms In A Compound SELECT Statement 默认值500,我觉得这个也不会超过啊
* Maximum Length Of A LIKE Or GLOB Pattern 默认值50000,特别标注了时间复杂度是$$N^2$$,N是字符总数
* Maximum Number Of Host Parameters In A Single SQL Statement 默认是999
* Maximum Depth Of Trigger Recursion v3.6.18 开始支持,v3.7.0默认值是1000
* Maximum Number Of Attached Databases 支持的DB数,默认是10,最大不能超过125
* Maximum Number Of Pages In A Database File 一般设置1073741823,最大数字2147483646,When used with the maximum page size of 65536, this gives a maximum SQLite database size of about 140 terabytes.
* Maximum Number Of Rows In A Table $$2^{64} $$(18446744073709551616 or about 1.8e+19),这是一个不可到达的数字,因为会先超过文件大小
* Maximum Database Size Every database consists of one or more "pages". Within a single database, every page is the same size, but different database can have page sizes that are powers of two between 512 and 65536, inclusive. The maximum size of a database file is 2147483646 pages. At the maximum page size of 65536 bytes, this translates into a maximum database size of approximately 1.4e+14 bytes (140 terabytes, or 128 tebibytes, or 140,000 gigabytes or 128,000 gibibytes).
* Maximum Number Of Tables In A Schema  

please help the poor man.

------------------------

今天发现了一点蛛丝马迹,不确定是不是这个问题:

* I deleted a lot of data but the database file did not get any smaller. Is this a bug?

No. When you delete information from an SQLite database, the unused disk space is added to an internal "free-list" and is reused the next time you insert data. The disk space is not lost. But neither is it returned to the operating system.

If you delete a lot of data and want to shrink the database file, run the [VACUUM](http://www.sqlite.org/lang_vacuum.html) command. VACUUM will reconstruct the database from scratch. This will leave the database with an empty free-list and a file that is minimal in size. Note, however, that the VACUUM can take some time to run and it can use up to twice as much temporary disk space as the original file while it is running.

An alternative to using the VACUUM command is auto-vacuum mode, enabled using the [auto_vacuum pragma](http://www.sqlite.org/pragma.html#pragma_auto_vacuum).



> [Limits In SQLite](http://www.sqlite.org/limits.html)<br />
[what-are-the-performance-characteristics-of-sqlite-with-very-large-database-files](http://stackoverflow.com/questions/784173/what-are-the-performance-characteristics-of-sqlite-with-very-large-database-files)