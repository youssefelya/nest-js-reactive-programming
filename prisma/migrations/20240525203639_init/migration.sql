BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Question] (
    [id] VARCHAR(40) NOT NULL,
    [simpleHelpText] VARCHAR(max),
    [popupHelpText] VARCHAR(max),
    [text] NVARCHAR(1000) NOT NULL,
    [created_on] DATETIME2 CONSTRAINT [Question_created_on_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_on] DATETIME2,
    [is_deleted] BIT NOT NULL CONSTRAINT [Question_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Question_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Option] (
    [id] VARCHAR(40) NOT NULL,
    [legacyId] VARCHAR(40),
    [refId] VARCHAR(40),
    [name] NVARCHAR(1000) NOT NULL,
    [isOther] BIT NOT NULL CONSTRAINT [Option_isOther_df] DEFAULT 0,
    [created_on] DATETIME2 CONSTRAINT [Option_created_on_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_on] DATETIME2,
    [is_deleted] BIT NOT NULL CONSTRAINT [Option_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Option_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] VARCHAR(40) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [created_on] DATETIME2 CONSTRAINT [Tag_created_on_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_on] DATETIME2,
    [is_deleted] BIT NOT NULL CONSTRAINT [Tag_is_deleted_df] DEFAULT 0,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_QuestionToTag] (
    [A] VARCHAR(40) NOT NULL,
    [B] VARCHAR(40) NOT NULL,
    CONSTRAINT [_QuestionToTag_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_OptionToTag] (
    [A] VARCHAR(40) NOT NULL,
    [B] VARCHAR(40) NOT NULL,
    CONSTRAINT [_OptionToTag_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_OptionToQuestion] (
    [A] VARCHAR(40) NOT NULL,
    [B] VARCHAR(40) NOT NULL,
    CONSTRAINT [_OptionToQuestion_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_QuestionToTag_B_index] ON [dbo].[_QuestionToTag]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_OptionToTag_B_index] ON [dbo].[_OptionToTag]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_OptionToQuestion_B_index] ON [dbo].[_OptionToQuestion]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_QuestionToTag] ADD CONSTRAINT [_QuestionToTag_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Question]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_QuestionToTag] ADD CONSTRAINT [_QuestionToTag_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_OptionToTag] ADD CONSTRAINT [_OptionToTag_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Option]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_OptionToTag] ADD CONSTRAINT [_OptionToTag_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_OptionToQuestion] ADD CONSTRAINT [_OptionToQuestion_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Option]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_OptionToQuestion] ADD CONSTRAINT [_OptionToQuestion_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Question]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
